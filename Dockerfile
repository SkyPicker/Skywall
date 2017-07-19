# This file is a docker file to build Skywall server image. Note that only Skywall server may be run from docker.
# It makes no sence to run Skywall clients from Docker, as they need to work directly with their host machines.
#
# This Docker file has enabled Skywall iptables module as well.
#
# Build with:
#   docker build -t skywall .
#
# Run with:
#   docker run -p 8080:8080 -p 9000:9000 -e skywall_server_database=postgres://USER:PASSWORD@HOST/DATABASE skywall

FROM ubuntu:16.04
WORKDIR /opt/skywall

ENV skywall_modules skywall_iptables

RUN apt-get update
RUN apt-get install -y build-essential python3-dev libpq-dev virtualenv git
RUN virtualenv --python=/usr/bin/python3 env
RUN bash -c "source env/bin/activate && pip install git+https://github.com/SkyPicker/Skywall.git"
RUN bash -c "source env/bin/activate && pip install git+https://github.com/SkyPicker/Skywall-iptables.git"
RUN bash -c "source env/bin/activate && nodeenv -p --node=7.7.4"
RUN bash -c "source env/bin/activate && skywall install"
RUN bash -c "source env/bin/activate && skywall build"

EXPOSE 9000 8080
CMD bash -c "source env/bin/activate && skywall server"
