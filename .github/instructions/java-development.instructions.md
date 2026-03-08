---
applyTo: "**/bundle/src/main/java/**/*.java"
---

# BMC Helix Innovation Studio — Java Development Rules

When creating or modifying Java files in this project, follow these rules.

## Mandatory Reading Before Code Changes

1. Read `cookbook/06-java-backend.md` for service patterns
2. Read `cookbook/09-best-practices.md` (Java section)
3. Read `cookbook/11-troubleshooting.md` (AR System Error Codes + AI patterns that fail)
4. After changes, run through `cookbook/10-checklists.md` (Java Build & Deploy Checklist)

## Critical Platform Quirks

- **Dates**: ALWAYS epoch millis (`System.currentTimeMillis()`), NEVER ISO 8601
- **Transactions**: `@RxDefinitionTransactional` ONLY on REST endpoints, NOT on services called by Rules
- **Record creation**: ALWAYS set Status (field 7) and Description (field 8)
- **Attachments**: Persist AFTER parent record creation, never before
- **No threads**: Code must be synchronous (no Thread, sleep, synchronized)
- **No file I/O**: Use RecordService for persistence
- **No static state**: Use CacheService for caching

## Service Registration

Register in `MyApplication.java` → `register()` method, BEFORE `registerStaticWebResource()`:

```java
registerService(new MyProcessActivity());
```

Do NOT remove existing registrations or commented code in `MyApplication.java`.

## Build & Deploy

```bash
# Backend-only build (skip frontend, saves ~2 min)
mvn clean install -Pdeploy -DskipTests -PskipUICodeGeneration

# Verify classes in JAR
jar tf bundle/target/*.jar | grep 'bundle/.*\.class' | sort
```

## Detailed Reference

- Process activity details: `.cursor/_instructions/Java/ObjectTypes/process-activity.md`
- REST API details: `.cursor/_instructions/Java/ObjectTypes/rest-api.md`
- RecordService: `.cursor/_instructions/Java/Services/records.md`
- CacheService: `.cursor/_instructions/Java/Services/cache.md`
- Process definition creation: `.cursor/_instructions/Java/Template/create-process-definition.md`
