FROM denoland/deno
COPY . /code
EXPOSE 8000
WORKDIR /code
CMD ["deno","run","-A","main.ts"]