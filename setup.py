import os
from setuptools import setup, find_packages


with open(os.path.join(os.path.dirname(__file__), 'requirements.txt')) as f:
    requirements = f.read().splitlines()

with open(os.path.join(os.path.dirname(__file__), 'README.md')) as f:
    readme = f.read()

def find_data_files(items):
    res = []
    base_path = os.path.dirname(__file__)
    for (dest, sources) in items:
        for source in sources:
            source_path = os.path.join(base_path, source)
            if os.path.isdir(source_path):
                for (path, directories, filenames) in os.walk(source_path):
                    for filename in filenames:
                        path_relative = os.path.relpath(path, base_path)
                        res.append((os.path.join(dest, path_relative), [os.path.join(path_relative, filename)]))
            else:
                res.append((dest, [source]))
    return res

setup(
    name='skywall',
    version='0.0.1',
    description='Client-Server based manager for connecting systems together and running tasks.',
    long_description=readme,
    url='https://github.com/SkyPicker/Skywall',
    author='',
    author_email='',
    license='SEE LICENSE IN ./LICENSE',
    install_requires=requirements,
    packages=find_packages(),
    zip_safe=False,
    data_files=find_data_files([
        ('share/skywall', [
            '.babelrc',
            'package.json',
            'frontend',
            'webpack',
            ]),
        ]),
    entry_points={
        'console_scripts': [
            'skywall = skywall:run_skywall',
            ],
        },
    )
