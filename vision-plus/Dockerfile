FROM postgres:17
 
# تثبيت أدوات البناء
RUN apt-get update && apt-get install -y \
    build-essential postgresql-server-dev-17
 
# نسخ الكود المحلي ل pg_uuidv7 داخل الحاوية
COPY pg_uuidv7 /pg_uuidv7
 
# بناء وتثبيت الامتداد
RUN cd /pg_uuidv7 && make && make install
 
# نظيف: إزالة ملفات البناء لتقليل حجم الصورة (اختياري)
RUN rm -rf /pg_uuidv7