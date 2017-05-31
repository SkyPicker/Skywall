import os
import shutil
from setuptools import setup, find_packages


root = os.path.dirname(__file__)

def requirements():
    with open(os.path.join(root, 'requirements.txt')) as f:
        return f.read().splitlines()

def readme():
    with open(os.path.join(root, 'README.md')) as f:
        return f.read()

def move(src, dest):
    src = os.path.join(root, src)
    dest = os.path.join(root, dest)
    if os.path.exists(src) and not os.path.exists(dest):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.move(src, dest)


move('.babelrc', 'skywall/javascript/.babelrc')
move('package.json', 'skywall/javascript/package.json')
move('frontend', 'skywall/javascript/frontend-src')
move('webpack', 'skywall/javascript/webpack-src')

setup(
    name='skywall',
    version='0.0.1',
    description='Client-Server based manager for connecting systems together and running tasks.',
    long_description=readme(),
    url='https://github.com/SkyPicker/Skywall',
    author='',
    author_email='',
    license='GPL-3.0',
    install_requires=requirements(),
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    entry_points={
        'console_scripts': [
            'skywall = skywall:run_skywall',
            ],
        },
    )
