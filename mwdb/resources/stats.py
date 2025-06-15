from flask import Blueprint, jsonify
from mwdb.model.file import File

bp = Blueprint("stats", __name__, url_prefix="/api/stats")

@bp.route("/count_by_type")
def count_by_type():
    from mwdb.core import db
    result = db.session.query(File.type, db.func.count(File.id)).group_by(File.type).all()
    return jsonify([{"type": t, "count": c} for t, c in result])
