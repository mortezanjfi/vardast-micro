@echo off
setlocal enabledelayedexpansion

REM Check if NEXTAUTH_SECRET already exists in .env file
findstr /R "^NEXTAUTH_SECRET=" .env > nul

REM If NEXTAUTH_SECRET does not exist, generate a new secret and append it to .env
if not %errorlevel% equ 0 (
    REM Generate a new secret
    set "NEW_SECRET="
    for /l %%i in (1,1,32) do (
        set /a "RND=!random!%%16"
        for %%j in (!RND!) do (
            set "NEW_SECRET=!NEW_SECRET!%%j"
        )
    )
    echo NEXTAUTH_SECRET=!NEW_SECRET! >> .env
)

endlocal
