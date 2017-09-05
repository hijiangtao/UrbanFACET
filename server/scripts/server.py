#!/usr/bin/python
# author: qzane
try:
    import BaseHTTPServer
except:
    import http.server as BaseHTTPServer
import time
import json

import Clustermap

HOST_NAME = '0.0.0.0'
PORT_NUMBER = 18263  # best between 9999 ~ 32768


# try: http://127.0.0.1:18263/?add1=123&add2=111


def get_result(params):
    s = int(params['add1'])
    c = int(params['add2'])
    city = int(params['city'])
    result = Clustermap.main(s, c, city)
    return {}


class MyHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "application/json")
        s.end_headers()

    def do_GET(s):
        """Respond to a GET request."""
        print("#%s#" % s.path)
        try:
            params = {i.split('=')[0]: i.split('=')[1]
                      for i in s.path.split('?')[-1].split('&')}
        except:
            params = {}

        res = get_result(params)

        s.send_response(200)
        s.send_header("Content-type", "application/json")
        s.end_headers()

        s.wfile.write("successCallback(".encode('utf-8'))
        s.wfile.write(json.dumps(res).encode('utf-8'))
        s.wfile.write(")".encode('utf-8'))


if __name__ == '__main__':
    server_class = BaseHTTPServer.HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print("Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER))
    print(r"Try to visit http://127.0.0.1:%s/?add1=123&add2=111" % (PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print("Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER))

