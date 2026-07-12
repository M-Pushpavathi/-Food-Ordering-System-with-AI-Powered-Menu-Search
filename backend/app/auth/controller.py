from flask import request, jsonify
from app.auth.service import AuthService


class AuthController:

    @staticmethod
    def register():

        data = request.get_json()

        response, status = AuthService.register(data)

        return jsonify(response), status

    @staticmethod
    def login():

        data = request.get_json()

        response, status = AuthService.login(data)

        return jsonify(response), status