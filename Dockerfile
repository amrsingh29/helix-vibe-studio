# BMC Helix Innovation Studio Development Environment
# Podman users: Containerfile is an identical copy. Keep both in sync.
FROM ubuntu:22.04

# SDK version — passed from compose via build args, defaults to 25.4.00
ARG SDK_VERSION=25.4.00

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set up environment variables
ENV JAVA_HOME=/opt/java/openjdk
ENV MAVEN_HOME=/opt/maven
ENV NODE_VERSION=20.15.1
ENV YARN_VERSION=1.22.22
ENV GRUNT_VERSION=1.3.2
ENV MAVEN_VERSION=3.9.8
ENV RX_SDK_HOME=/opt/sdk/com.bmc.arsys.rx.sdk-${SDK_VERSION}
ENV PATH="${JAVA_HOME}/bin:${MAVEN_HOME}/bin:/opt/node/bin:${PATH}"
ENV MAVEN_OPTS="-Xms512m -Xmx1024m"

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    vim \
    nano \
    build-essential \
    ca-certificates \
    gnupg \
    python3 \
    python3-pip \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install OpenJDK 17.0.8.1
RUN mkdir -p ${JAVA_HOME} && \
    ARCH=$(uname -m) && \
    if [ "$ARCH" = "aarch64" ]; then \
        wget -q https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.8.1%2B1/OpenJDK17U-jdk_aarch64_linux_hotspot_17.0.8.1_1.tar.gz && \
        tar -xzf OpenJDK17U-jdk_aarch64_linux_hotspot_17.0.8.1_1.tar.gz -C ${JAVA_HOME} --strip-components=1 && \
        rm OpenJDK17U-jdk_aarch64_linux_hotspot_17.0.8.1_1.tar.gz; \
    else \
        wget -q https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.8.1%2B1/OpenJDK17U-jdk_x64_linux_hotspot_17.0.8.1_1.tar.gz && \
        tar -xzf OpenJDK17U-jdk_x64_linux_hotspot_17.0.8.1_1.tar.gz -C ${JAVA_HOME} --strip-components=1 && \
        rm OpenJDK17U-jdk_x64_linux_hotspot_17.0.8.1_1.tar.gz; \
    fi

# Install Maven 3.9.8
RUN wget -q https://archive.apache.org/dist/maven/maven-3/3.9.8/binaries/apache-maven-3.9.8-bin.tar.gz && \
    tar -xzf apache-maven-3.9.8-bin.tar.gz -C /opt && \
    mv /opt/apache-maven-3.9.8 ${MAVEN_HOME} && \
    rm apache-maven-3.9.8-bin.tar.gz

# Install Node.js 20.15.1
RUN mkdir -p /opt/node && \
    ARCH=$(uname -m) && \
    if [ "$ARCH" = "aarch64" ]; then \
        wget -q https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-arm64.tar.gz && \
        tar -xzf node-v${NODE_VERSION}-linux-arm64.tar.gz -C /opt/node --strip-components=1 && \
        rm node-v${NODE_VERSION}-linux-arm64.tar.gz; \
    else \
        wget -q https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz && \
        tar -xzf node-v${NODE_VERSION}-linux-x64.tar.gz -C /opt/node --strip-components=1 && \
        rm node-v${NODE_VERSION}-linux-x64.tar.gz; \
    fi

# Install Yarn 1.22.22
RUN npm install -g yarn@${YARN_VERSION}

# Install Grunt CLI 1.3.2
RUN npm install -g grunt-cli@${GRUNT_VERSION}

# Create workspace directory
RUN mkdir -p /workspace /opt/sdk

# Set working directory
WORKDIR /workspace

# Verify installations
RUN echo "Verifying installations..." && \
    java -version && \
    mvn -version && \
    node --version && \
    yarn --version && \
    grunt --version

# Default command
CMD ["/bin/bash"]

