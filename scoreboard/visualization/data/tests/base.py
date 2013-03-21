import os
import pytest

SPARQL_ENDPOINT = os.environ.get('CUBE_SPARQL_ENDPOINT')
DATASET_URI = os.environ.get('CUBE_DATASET_URI')
pytest.config.SKIP_SPARQL_TESTS = not (SPARQL_ENDPOINT and DATASET_URI)


def sparql_test(func):
    return pytest.mark.skipif("config.SKIP_SPARQL_TESTS")(func)


def create_cube():
    from scoreboard.visualization.data.cube import Cube
    return Cube(SPARQL_ENDPOINT, DATASET_URI)
