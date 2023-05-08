// eslint-disable-line
import axios from 'axios';
import router from '@/router';
import JSONBig from 'json-bigint';
// axios.defaults.retry = 4
// axios.defaults.retryDelay = 1000
// 创建axios实例

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_URL,
    // 自定义返回的元素数据,axios会默认用JSON.parse
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [
        function (data) {
            // 对 data 进行任意转换处理
            try {
                return JSONBig.parse(data);
            } catch (err) {
                return data;
            }
        }
    ]
});
// request拦截器
axiosInstance.interceptors.request.use(
    requestInfo => {
        if (requestInfo.headers) {
            requestInfo.headers['Content-Type'] = 'application/json;charset=UTF-8';
            const pathname  = requestInfo.url;
            if(pathname == '/admin/login'){
            } else {

                var tokenName = sessionStorage.getItem("tokenName");
                var tokenValue = sessionStorage.getItem("tokenValue");

                if (tokenName && tokenValue) {
                    if (pathname != '/' && pathname != '/admin/login') {
                      requestInfo.headers[tokenName] = tokenValue;
                    }
                }
            }
        }
        return requestInfo;
    },
    error => {
        return Promise.reject(error);
    }
);
// respone拦截器
axiosInstance.interceptors.response.use(
    response => {
        console.log(response);
        if(response.data.code == 0)
        {
            return response.data;
        }else {
            if(response.data.code == 10006){
                sessionStorage.clear();
                router.push({path: '/login'})
            }
            if(response.data.code == 10100){
                alert("该人物在数据库里不存在")
            }
        }
        return Promise.reject(new Error(response.data.message))
    },
    error => {
        try {
        } catch (error) {
            return Promise.reject(error);
        }
    }
);
// interface AxRequestConfig extends AxiosRequestConfig {
//   interceptors?: AxRequestConfig;
//   headers?: any;
// } // request拦截器
// service.interceptors.request.use(
//   (config: AxRequestConfig) => {
//     // if (config.url === "login") {
//     //   config.data = qs.stringify(config.data);
//     //   config.headers.withCredentials = "true";
//     //   axios.defaults.headers.post["Content-Type"] =
//     //     "application/json;charset=UTF-8";
//     // }
//     if (sessionStorage.token) {
//       let token = "x-token";
//       config.headers[token] = sessionStorage.token;
//     } else {
//       // router.push("/login");
//     }
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     Promise.reject(error);
//   }
// );
// respone拦截器
// service.interceptors.response.use(
//   (response) => {
//     // console.log(response);
//     // if(response.headers.errorcount){
//     //   return response
//     // }else{
//     return response.data;
//     // }
//     // return response;
//   },
//   (error) => {
//     try {
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   }
// );

export default axiosInstance;
