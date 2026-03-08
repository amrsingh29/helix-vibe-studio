# Commands to run on your local environment before you can start working on the project.

## Prerequisites
Before generating View Components or running the application, ensure the following are installed and configured:

1. **Node.js**: Version 20.15.1
   ```bash
   node --version
   ```
You can set the nodeJs version using this command if `nvm` is installed on the system:
```bash
nvm use 20.15.1
```

2. **Yarn**: Version 1.22.22

   Check your version:
   ```bash
   yarn --version
   ```

   If Yarn is not installed or you need to upgrade:
   ```bash
   npm install -g yarn@1.22.22
   ```

3. **Java**: JDK 17.0.x
   ```bash
   java -version
   ```

4. **BMC Helix Innovation Studio SDK**: Version 25.4.00 or compatible

   The SDK must be installed on your system. You can obtain the SDK from BMC.
   
   After installation, verify the SDK directory contains the necessary files:
   ```bash
   ls $RX_SDK_HOME  # Should show SDK files and directories
   ```

## Environment Variables
Set the following environment variables:

### RX_SDK_HOME
Points to the location where the BMC Helix Innovation Studio SDK is installed.

**Example (Linux/macOS):**
```bash
export RX_SDK_HOME=/path/to/your/sdk/com.bmc.arsys.rx.sdk-25.4.00
```

**Example (Windows):**
```cmd
set RX_SDK_HOME=C:\path\to\your\sdk\com.bmc.arsys.rx.sdk-25.4.00
```

### JAVA_HOME
Points to your JDK 17 installation directory.

**Example (Linux/macOS):**
```bash
export JAVA_HOME=/path/to/your/jdk-17
```

**Example (macOS with Homebrew):**
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
```

**Example (Windows):**
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

### Hardcoded values for my environment
You can check the values set by the Developer in the file `my-env-vars.env` in folder `/_instructions`. It contains the values for the `RX_SDK_HOME` and `JAVA_HOME` environment variables. If the file exists, read the values from them.

## Verifying Your Setup
After setting the environment variables, verify they are correctly configured:

**Unix/Linux/macOS:**
```bash
echo $RX_SDK_HOME  # Should display your SDK path
echo $JAVA_HOME    # Should display your Java path
node --version     # Should display v20.15.1
yarn --version     # Should display 1.22.22
```

**Windows (CMD):**
```cmd
echo %RX_SDK_HOME%  
echo %JAVA_HOME%    
node --version      
yarn --version      
```

**Windows (PowerShell):**
```powershell
echo $env:RX_SDK_HOME  
echo $env:JAVA_HOME    
node --version         
yarn --version
java -version      # Should display version 17.0.x
```

## Notes
- If commands fail initially on zsh due to shell initialization, try running them again
- If an environment file is mentioned in chapter `Hardcoded values for my environment` and exist on the filesystem, get the environment variables from it.
