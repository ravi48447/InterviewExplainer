# How to Run Backend (Maven Not Installed)

## Option 1: Run Existing JAR (Easiest)

If you see `target\backend-api-0.0.1-SNAPSHOT.jar` exists:

```powershell
cd backend
java -jar target\backend-api-0.0.1-SNAPSHOT.jar
```

## Option 2: Use PowerShell Script

```powershell
cd backend
.\run.ps1
```

## Option 3: Install Maven

1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract to `C:\Program Files\Apache\maven`
3. Add to PATH:
   - Open System Properties → Environment Variables
   - Add `C:\Program Files\Apache\maven\bin` to PATH
4. Restart terminal and run: `mvn spring-boot:run`

## Option 4: Use IDE

### IntelliJ IDEA:
1. Open `backend` folder as project
2. Right-click `BackendApiApplication.java`
3. Select "Run 'BackendApiApplication'"

### Eclipse:
1. Import as Maven project
2. Right-click project → Run As → Spring Boot App

### VS Code:
1. Install "Extension Pack for Java"
2. Open `BackendApiApplication.java`
3. Click "Run" button above main method

## Option 5: Create Maven Wrapper

If you have Maven installed temporarily or via IDE:

```powershell
# One-time setup (if you can get Maven working once)
mvn wrapper:wrapper
```

Then use:
```powershell
.\mvnw.cmd spring-boot:run
```

## Quick Test

After starting, test if backend is running:
```powershell
curl http://localhost:8080/api/v1/domains
```

Or open in browser: http://localhost:8080/api/v1/domains

