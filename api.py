from flask import *
import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv
import requests

load_dotenv()
rdspassword=os.getenv('rdspassword')

mydb = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=10,
    pool_reset_session=True,
    host="database-1.cmsdm1slqlgb.ap-southeast-1.rds.amazonaws.com",
    port=3306,
    user="admin",
    password=rdspassword,
    database="msg",
    buffered=True
)

api=Flask(__name__)

@api.route("/")
def index():
	return render_template("msgboard.html")

@api.route("/api/msg", methods=["POST"])
def saveindb():
    if request.json!=None:
        msg=request.json['msg']
        img=request.json['imgurl']
        myconnect=mydb.get_connection()
        mycursor=myconnect.cursor()
        savesql="insert into`msgboard`(`msg`,`image`) values(%s,%s)"
        savevalues=(msg,img)
        mycursor.execute(savesql,savevalues)
        myconnect.commit()
        myconnect.close()
        return jsonify(ok=True)
    else:
        return jsonify(error=True)

@api.route("/api/msg", methods=["GET"])
def getfromdb():
    myconnect=mydb.get_connection()
    mycursor=myconnect.cursor()
    getsql="select `msg`,`image` from `msgboard` order by `id` DESC"
    mycursor.execute(getsql)
    myresult=mycursor.fetchall()
    myconnect.close()
    return jsonify(myresult)

@api.route("/api/msg/latest", methods=["GET"])
def getnewmsg():
    myconnect=mydb.get_connection()
    mycursor=myconnect.cursor()
    sql="select `msg`,`image` from `msgboard` order by `id` DESC limit %s"
    value=(1,)
    mycursor.execute(sql,value)
    myresult=mycursor.fetchone()
    myconnect.close()
    return jsonify(myresult)
	
if __name__ == '__main__':
    api.run(host="0.0.0.0",debug=True)