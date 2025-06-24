import streamlit as st
import requests
import pandas as pd
import graphviz
from datetime import datetime

API_URL = "http://mwdb:8080/api"
TOKEN = st.secrets.get("api_token", "")

st.set_page_config(page_title="MWDB Dashboard", layout="wide")

# Sidebar authentication
st.sidebar.title("Authentication")
if not TOKEN:
    TOKEN = st.sidebar.text_input("Enter your MWDB API token", type="password")
    if TOKEN:
        st.experimental_set_query_params(token=TOKEN)
headers = {"Authorization": f"Bearer {TOKEN}"}

@st.cache_data(show_spinner=False)
def fetch_objects():
    try:
        r = requests.get(f"{API_URL}/object", headers=headers)
        r.raise_for_status()
        return r.json().get("objects", [])
    except Exception as e:
        st.error(f"Failed to fetch objects: {e}")
        return []

@st.cache_data(show_spinner=False)
def fetch_file_details(obj_id):
    try:
        r = requests.get(f"{API_URL}/object/{obj_id}", headers=headers)
        r.raise_for_status()
        return r.json()
    except Exception:
        return {}

def enrich_objects(objects):
    rows = []
    progress = st.progress(0)
    for i, obj in enumerate(objects):
        detail = fetch_file_details(obj["id"])
        tag_list = detail.get("tags", [])
        tags = [t["tag"] for t in tag_list if isinstance(t, dict) and "tag" in t]
        rows.append({
            "id": detail.get("id"),
            "name": obj.get("name", detail.get("id")),
            "upload_time": pd.to_datetime(detail.get("upload_time")),
            "tags": tags,
            "md5": detail.get("md5", ""),
            "sha256": detail.get("sha256", ""),
            "user": obj.get("user", "unknown"),
            "parents": detail.get("parents", []),
            "children": detail.get("children", [])
        })
        progress.progress((i + 1) / len(objects))
    return pd.DataFrame(rows)

if TOKEN:
    st.title("MWDB Dashboard")
    objects = fetch_objects()
    if not objects:
        st.warning("No data available.")
    else:
        df = enrich_objects(objects)
        all_tags = sum(df["tags"].tolist(), [])
        unique_tags = sorted(set(all_tags))

        # Sidebar filters
        st.sidebar.title("Filters")
        selected_tags = st.sidebar.multiselect("Filter by Tags", unique_tags)
        search_query = st.sidebar.text_input("Search by SHA256 or File Name")

        filtered_df = df.copy()
        if selected_tags:
            filtered_df = filtered_df[filtered_df["tags"].apply(lambda x: any(tag in x for tag in selected_tags))]
        if search_query:
            filtered_df = filtered_df[
                filtered_df["sha256"].str.contains(search_query) |
                filtered_df["name"].str.contains(search_query)
            ]

        # Layout
        tab1, tab2, tab3, tab4 = st.tabs(["Overview", "Files Table", "File Details", "Relationships"])

        with tab1:
            st.header("Statistics Overview")
            col1, col2, col3 = st.columns(3)
            col1.metric("Total Samples", len(df))
            col2.metric("Unique Tags", len(set(all_tags)))
            col3.metric("Users", df["user"].nunique())

            st.subheader("Top Tags")
            tag_counts = pd.Series(all_tags).value_counts().head(20)
            if not tag_counts.empty:
                st.bar_chart(tag_counts)
            else:
                st.info("No tags available.")

        with tab2:
            st.header("Filtered Files")
            st.dataframe(filtered_df[["name", "upload_time", "md5", "sha256"]]
                         .sort_values("upload_time", ascending=False),
                         use_container_width=True)

        with tab3:
            st.header("File Detail Viewer")
            if not filtered_df.empty:
                selected_file = st.selectbox("Select a file", filtered_df["id"].tolist())
                if selected_file:
                    detail = fetch_file_details(selected_file)
                    st.subheader("Raw JSON Response")
                    st.json(detail)

                    dot = graphviz.Digraph()
                    file_name = filtered_df.loc[filtered_df["id"] == selected_file, "name"].values[0]
                    dot.node(selected_file, file_name, color="lightblue")
                    for parent in detail.get("parents", []):
                        pid = parent["id"] if isinstance(parent, dict) else parent
                        dot.node(pid, pid, color="gray")
                        dot.edge(pid, selected_file)
                    for child in detail.get("children", []):
                        cid = child["id"] if isinstance(child, dict) else child
                        dot.node(cid, cid, color="gray")
                        dot.edge(selected_file, cid)
                    st.graphviz_chart(dot)
            else:
                st.info("No files matched your filters.")

        with tab4:
            st.header("Global Relationship Graph")
            if st.checkbox("Display all relationships"):
                dot = graphviz.Digraph()
                for _, row in df.iterrows():
                    dot.node(row["id"], row["name"], color="lightblue")
                    for parent in row["parents"]:
                        pid = parent["id"] if isinstance(parent, dict) else parent
                        pname = df[df["id"] == pid]["name"].values[0] if pid in df["id"].values else pid
                        dot.node(pid, pname, color="gray")
                        dot.edge(pid, row["id"])
                    for child in row["children"]:
                        cid = child["id"] if isinstance(child, dict) else child
                        cname = df[df["id"] == cid]["name"].values[0] if cid in df["id"].values else cid
                        dot.node(cid, cname, color="gray")
                        dot.edge(row["id"], cid)
                st.graphviz_chart(dot)
else:
    st.info("Token is missing. Please enter your API token in the sidebar.")