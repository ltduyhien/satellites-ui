FROM --platform=linux/amd64 scratch
# FROM --platform=linux/amd64: Force this image to be built as amd64 architecture.
# The larvis binary is compiled for linux-amd64. Without this flag, Docker on ARM Macs
# would build an ARM image with an amd64 binary inside, causing a platform mismatch.
# On ARM Macs, Colima/Docker uses Rosetta emulation to run amd64 containers.

COPY larvis /larvis

EXPOSE 8080

ENTRYPOINT ["/larvis"]
