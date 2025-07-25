import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
    faFile,
    faTable,
    faScroll,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuthContext } from "@mwdb-web/commons/auth";
import { ConfigContext } from "@mwdb-web/commons/config";
import { fromPlugins, Extendable } from "@mwdb-web/commons/plugins";
import { ConfirmationModal, NavDropdown } from "@mwdb-web/commons/ui";
import { useRemote, useRemotePath } from "@mwdb-web/commons/remotes";

import logo from "../assets/logo.png";
import { AdminNav } from "./AdminNav";
import { RemoteDropdown } from "./RemoteDropdown";
import { Upload } from "./Upload/common/Upload";

export function Navigation() {
    const auth = useContext(AuthContext);
    const config = useContext(ConfigContext);

    const remote = useRemote();
    const remotePath = useRemotePath();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [allFileDetailsArray, setAllFileDetailsArray] = useState<any[]>([]);

    // Fetch all file details on mount or when auth changes
    useEffect(() => {
        async function fetchFileDetails() {
            if (!auth.isAuthenticated) {
                setAllFileDetailsArray([]);
                return;
            }
            try {
                const apiUrl = `${remotePath || ""}/api/object`;
                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error(`Error fetching files: ${res.statusText}`);
                const data = await res.json();
                setAllFileDetailsArray(data.objects || []);
            } catch (error) {
                console.error("Failed to fetch file details:", error);
                setAllFileDetailsArray([]);
            }
        }
        fetchFileDetails();
    }, [auth.isAuthenticated, remotePath]);

    const navItems = config.isReady ? (
        <Extendable ident="navbar">
            {auth.isAuthenticated ? (
                <Extendable ident="navbarAuthenticated">
                    <li className="nav-item">
                        <Link className="nav-link" to={"/"}>
                            <FontAwesomeIcon
                                className="navbar-icon"
                                icon={faFile}
                            />
                            Samples
                        </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                          to="/dashboard"
                          state={{ selectedFiles: allFileDetailsArray }}
                          className="nav-link"
                      >
                        <FontAwesomeIcon className="navbar-icon" icon={faTable} />
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/configs"}>
                            <FontAwesomeIcon
                                className="navbar-icon"
                                icon={faTable}
                            />
                            Configs
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/blobs"}>
                            <FontAwesomeIcon
                                className="navbar-icon"
                                icon={faScroll}
                            />
                            Blobs
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Upload />
                    </li>
                </Extendable>
            ) : (
                []
            )}
            {auth.isAuthenticated ? (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/search"}>
                            Search
                        </Link>
                    </li>
                    <AdminNav />
                    <li className="nav-item">
                        <Link className="nav-link" to={"/configs/stats"}>
                            Statistics
                        </Link>
                    </li>
                </>
            ) : (
                []
            )}
            <NavDropdown
                title="About"
                elements={[
                    ...(auth.isAuthenticated
                        ? [
                              <Link
                                  key="about"
                                  className="dropdown-item"
                                  to="/about"
                              >
                                  About mwdb
                              </Link>,
                              <Link
                                  key="docs"
                                  className="dropdown-item"
                                  to="/docs"
                              >
                                  Docs
                              </Link>,
                          ]
                        : []),
                    ...fromPlugins("navdropdownAbout"),
                ]}
            />
            <NavDropdown
                title="Extras"
                elements={[...fromPlugins("navdropdownExtras")]}
            />
        </Extendable>
    ) : (
        []
    );

    const remoteNavItems =
        config.isReady && auth.isAuthenticated ? (
            <Extendable ident="navbarAuthenticated">
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to={`${remotePath}/`}>
                            <FontAwesomeIcon
                                className="navbar-icon"
                                icon={faFile}
                            />
                            Samples
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={`${remotePath}/configs`}>
                            <FontAwesomeIcon
                                className="navbar-icon"
                                icon={faTable}
                            />
                            Configs
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={`${remotePath}/blobs`}>
                            <FontAwesomeIcon
                                className="navbar-icon"
                                icon={faScroll}
                            />
                            Blobs
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={`${remotePath}/search`}>
                            Search
                        </Link>
                    </li>
                </>
            </Extendable>
        ) : (
            []
        );

    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <Link className="navbar-brand" to="/">
                <Extendable ident="navbarLogo">
                    <img src={logo} alt="logo" className="logo" />
                    {config.config["instance_name"]}
                </Extendable>
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
            >
                <span className="navbar-toggler-icon" />
            </button>
            <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
            >
                <ul className="navbar-nav mr-auto">
                    {remote ? remoteNavItems : navItems}
                </ul>
                <div className="my-2 my-lg-0">
                    <ul className="navbar-nav">
                        <Extendable ident="navbarRight">
                            {auth.isAuthenticated ? (
                                <>
                                    <RemoteDropdown />
                                    <li className="nav-item">
                                        <div className="btn-group">
                                            {remote ? (
                                                <Link
                                                    className="btn btn-outline-info"
                                                    to={"/"}
                                                >
                                                    Local instance
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        className="btn btn-outline-success profile-button"
                                                        to="/profile"
                                                    >
                                                        <FontAwesomeIcon
                                                            className="navbar-icon"
                                                            icon={faUser}
                                                        />
                                                        {auth.user.login}
                                                    </Link>
                                                    <ConfirmationModal
                                                        isOpen={isModalOpen}
                                                        message="Logout"
                                                        cancelText="Logout only from MWDB"
                                                        confirmText={`Logout from MWDB and ${auth.user.provider}`}
                                                        onCancel={() => {
                                                            setIsModalOpen(false);
                                                            auth.logout();
                                                        }}
                                                        onRequestClose={() => {
                                                            setIsModalOpen(false);
                                                        }}
                                                        onConfirm={async () => {
                                                            setIsModalOpen(false);
                                                            let e = await auth.oAuthLogout();
                                                            auth.logout(e);
                                                        }}
                                                        buttonStyle="btn-danger"
                                                    >
                                                        You are about to log out
                                                        from MWDB
                                                    </ConfirmationModal>
                                                    <a
                                                        className="btn btn-outline-danger"
                                                        href="#logout"
                                                        onClick={(ev) => {
                                                            ev.preventDefault();
                                                            if (!auth.user.provider) {
                                                                auth.logout();
                                                            } else {
                                                                setIsModalOpen(true);
                                                            }
                                                        }}
                                                    >
                                                        Logout
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                </>
                            ) : (
                                []
                            )}
                        </Extendable>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
