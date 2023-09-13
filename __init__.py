from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from dotenv import load_dotenv
from . import models

# Load the .env file from the current directory
load_dotenv()

# You can access environment variables as usual
import os

db_CONNECTION = os.getenv("db_CONNECTION")
db_HOST = os.getenv("db_HOST")
db_PORT = os.getenv("db_PORT")
db_DATABASE = os.getenv("db_DATABASE")
db_USERNAME = os.getenv("db_USERNAME")
db_PASSWORD = os.getenv("db_PASSWORD")


def create_app():
    app = Flask(__name__) # creates the Flask instance, __name__ is  
                          # the name of the current Python module
    app.config['SECRET_KEY'] = (f"{db_PASSWORD}") # it is used 
                         #by Flask and extensions to keep data safe
    app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"{db_CONNECTION}://{db_USERNAME}:{db_PASSWORD}@{db_HOST}:{db_PORT}/{db_DATABASE}"
) 
                   #it is the path where the SQLite database file 
                   #will be saved
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
                   # deactivate Flask-SQLAlchemy track modifications
    db = SQLAlchemy(app) # Initialiaze sqlite database
    # The login manager contains the code that lets your application    
    # and Flask-Login work together
    login_manager = LoginManager() # Create a Login Manager instance
    login_manager.login_view = 'auth.login' # define the redirection 
                         # path when login required and we attempt 
                         # to access without being logged in
    login_manager.init_app(app) # configure it for login
    from models import User
    @login_manager.user_loader
    def load_user(user_id): #reload user object from the user ID 
                            #stored in the session
        # since the user_id is just the primary key of our user 
        # table, use it in the query for the user
        return User.query.get(int(user_id))
    # blueprint for auth routes in our app
    # blueprint allow you to orgnize your flask app
    from auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)
    # blueprint for non-auth parts of app
    from main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    return app
    