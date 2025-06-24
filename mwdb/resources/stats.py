from flask import Blueprint, jsonify
from mwdb.model.file import File
from mwdb.model.object import Object
from mwdb.model.tag import Tag
from mwdb.model.user import User
from mwdb.model import db
from sqlalchemy import func

bp = Blueprint("stats", __name__, url_prefix="/api/stats")

@bp.route("/count_by_type")
def count_by_type():
    result = (
        db.session.query(File.file_type, func.count(File.id))
        .group_by(File.file_type)
        .all()
    )
    return jsonify([{"type": t or "unknown", "count": c} for t, c in result])

@bp.route("/count_by_tag")
def count_by_tag():
    result = (
        db.session.query(Tag.tag, func.count(Tag.object_id))
        .join(Object, Object.id == Tag.object_id)
        .filter(Object.type == 'file')
        .group_by(Tag.tag)
        .all()
    )
    return jsonify([{"tag": t, "count": c} for t, c in result])

@bp.route("/upload_timeline")
def upload_timeline():
    result = (
        db.session.query(func.date(File.upload_time).label("date"), func.count(File.id))
        .group_by("date")
        .order_by("date")
        .all()
    )
    return jsonify([{"date": d.isoformat(), "count": c} for d, c in result])

@bp.route("/count_by_user")
def count_by_user():
    result = (
        db.session.query(User.login, func.count(File.id))
        .join(Object, File.id == Object.id)               # File → Object polymorphic join
        .join(User, User.id == Object.created_by)         # Object.created_by → User.id
        .group_by(User.login)
        .all()
    )
    return jsonify([{"user": u or "unknown", "count": c} for u, c in result])
