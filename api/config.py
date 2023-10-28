class Config(object):
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    ENV = "development"
    DEVELOPMENT = True


class TestingConfig(DevelopmentConfig):
    TESTING = True
