@echo off
wt ^
    -w 0 nt -p "Command Prompt" cmd /k "cd /d C:\Users\Yazan Ad\Desktop\Vision\vision-plus\frontend\landing-page && npm run dev" ^
    ; nt -p "Command Prompt" cmd /k "cd /d C:\Users\Yazan Ad\Desktop\Vision\vision-plus\frontend\admin-portal && npm run dev" ^
    ; nt -p "Command Prompt" cmd /k "cd /d C:\Users\Yazan Ad\Desktop\Vision\vision-plus\frontend\merchant-portal && npm run dev"
