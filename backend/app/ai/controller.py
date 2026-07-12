from flask import request, jsonify

from app.ai.service import AIService


class AIController:

    @staticmethod
    def search():

        if request.method == "GET":
            query = request.args.get("q", "")
        else:
            data = request.get_json()
            query = data.get("query", "")

        result = AIService.search(query)

        return jsonify(result)