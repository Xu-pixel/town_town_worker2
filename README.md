## 后端加数据库部署

```shell
#生成一个网段
docker network create town

#启动数据库
docker run -itd --net town --name mongo mongo

#构建后端
docker build . -t town_server  
#启动后端
docker run -d --net town -p 8000:8000 -e MONGO_URL=mongodb://mongo:27017 -v $PWD/images:/code/images town_server  

# 数据库 监控
docker run -d --net town -e ME_CONFIG_MONGODB_SERVER=mongo -p 8081:8081 mongo-express
```

实际部署时记得添加必要的环境变量
