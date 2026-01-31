# *AWS Secure SERVERLESS WEB APP* 

# **Introduction**

This project implements a **secure serverless web application on Amazon Web Services (AWS)** for managing student data. The application enables users to add and view student records through a web interface. The frontend is hosted as a static website on **Amazon S3** and delivered securely using **Amazon CloudFront**, which enforces HTTPS, improves performance through global caching, and integrates with **AWS Web Application Firewall (WAF)** to protect the application from common web-based attacks such as SQL injection and cross-site scripting.

The backend architecture uses **Amazon API Gateway**, **AWS Lambda**, and **Amazon DynamoDB**. API Gateway exposes RESTful endpoints that invoke Lambda functions to process requests, while DynamoDB stores student information in a scalable NoSQL database. The application follows a **fully serverless architecture**, eliminating server management, enabling automatic scaling, and operating on a pay-as-you-use pricing model. By integrating CloudFront with AWS WAF and IAM-based access control, the project demonstrates a secure, scalable, and production-ready serverless web application.

## **Tech Stack Used** 

### **☁️ Cloud Platform**

* **Amazon Web Services (AWS)**

### **🖥️ Frontend**

* **HTML** – Web page structure  
* **JavaScript** – Client-side logic  
* **Amazon S3 (Static Website Hosting)** – Hosts frontend files  
* **Amazon CloudFront** – CDN \+ HTTPS delivery

### **🔐 Security**

* **AWS WAF (Web Application Firewall)** – Protects application from common web attacks  
* **IAM Roles & Policies** – Secure access control between AWS services  
* **CORS (API Gateway)** – Enables secure frontend-backend communication

### **🔗 Backend**

* **Amazon API Gateway (REST API)** – Exposes GET & POST endpoints  
* **AWS Lambda (Python 3.12)** – Backend business logic

### **🗄️ Database**

* **Amazon DynamoDB** – NoSQL database for storing student records

## 

## **Architecture – Diagram**

![Untitled design](https://github.com/user-attachments/assets/86fd9f13-6ed6-4fa4-81ce-7792adace9e2)

## **Steps to Design**   

## **1️⃣ CREATE DYNAMODB TABLE**

### **Step 1: Open DynamoDB**

AWS Console → DynamoDB → **Create table**

### **Step 2: Table configuration**

* **Table name**: `studentData`  
* **Partition key**:  
  * Name: `studentID`  
  * Sort Key: Leave it  
* Table Setting:  
* Create table

✅ Table status must be **ACTIVE**

## **2️⃣ CREATE IAM ROLE FOR LAMBDA**

### **Step 1: IAM → Roles → Create role**

* Trusted entity: **AWS service**  
* Service: **Lambda**

### **Step 2: Attach policies**

Attach:

* `AWSLambdaBasicExecutionRole`  
* `AWSDynamoDBFulless`

**Role name:**

**`lambda-dynamoDB-role`**

## **3️⃣ CREATE LAMBDA FUNCTIONS**

### **A. GET STUDENTS LAMBDA**

#### **Step 1: Create Lambda**

* **Name: `getStudents`**  
* **Runtime: Python 3.12**  
* **Role: `lambda-dynamoDB-role`**  
* **Click on create function** 

**Step 2: Paste the following Code**

**import json**

**import boto3**

**from decimal import Decimal**

**class DecimalEncoder(json.JSONEncoder):**

   **def default(self, obj):**

       **if isinstance(obj, Decimal):**

           **\# convert Decimal → int or float**

           **return int(obj) if obj % 1 \== 0 else float(obj)**

       **return super(DecimalEncoder, self).default(obj)**

**def lambda\_handler(event, context):**

   **dynamodb \= boto3.resource('dynamodb')**

   **table \= dynamodb.Table('studentData')**

   **response \= table.scan()**

   **data \= response\['Items'\]**

   **return {**

       **"statusCode": 200,**

       **"headers": {**

           **"Content-Type": "application/json"**

       **},**

       **"body": json.dumps(data, cls\=DecimalEncoder)**

   **}**

* **Click on Deploy**  
* **Create a test**  
*  **Name: myTest**  
*  **Use existing template to test**		 

   **{**

    **"key1": "value1",**

    **"key2": "value2",**

    **"key3": "value3"**

  **}**

* **Click on Test Button** 

*When we click on Test Button this will invoke the lambda function and this lambda function will go to retrieve data from dynamoDB table* 

**Response:**

**\[ \]**  

**Empty list because there is nothing what we test for as we have not inserted anything in our table yet.**

### **B. POST STUDENT LAMBDA**

#### **Step 1: Create Lambda**

* **Name: `postStudent`**  
* **Runtime: Python 3.12**  
* **Role: `lambda-dynamoDB-role`**  
* **Click on create function** 

**Step 2: Paste the following Code**

**import json**

**import boto3**

**dynamodb \= boto3.resource('dynamodb')**

**table \= dynamodb.Table('studentData')**

**def lambda\_handler(event, context):**

   **body \= json.loads(event\['body'\]) if 'body' in event else event**

   **table.put\_item(**

       **Item\={**

           **'studentID': body\['studentID'\],**

           **'name': body\['name'\],**

           **'class': body\['class'\],**

           **'age': int(body\['age'\])**

       **}**

   **)**

   **\# IMPORTANT: return RAW JSON (same style as GET)**

   **return {**

       **"message": "Student data saved successfully"**

   **}**

* **Click on Deploy**  
* **Create a test for `postStudent`lambda function**  
* **Name: myTest**  
* **Use existing template to test**		 

  **{**

      **"studentID": "1",**

      **"name": "Ram",**

      **"class": "10",**

      **"age": 15**

    **}**

* **Click on Test Button** 

**Response:**

**{**

  **"message": "Student data saved successfully"**

**}**

## **4️⃣ CREATE API GATEWAY (REST API)**

### **Step 1: Create API**

**API Gateway → Create API → REST API → Build**

* **New Api**  
* **API name: `StudentData`**  
* **API endpoint: Edge-optimized (allow user from around the world)**

**Now we will need to create *GET* and *POST* methods**

* **Method Type: GET**  
* **Integration Type: Lambda Function**  
* **Region: Same Region**  
* **Lambda Function:  `getStudents` type**   
* **Click on create method** 

**To check whether it is correctly configured or not click on test:**

<img width="1680" height="1050" alt="Screenshot 2026-01-31 at 3 28 25 PM" src="https://github.com/user-attachments/assets/d6f7b58a-06e0-4f93-9b7a-8c99f77a01d0" />


**You will get:**

**Status: 200**

**Response body: Data from table** 

**Similarly for**

**Post method** 

* **Method Type: GET**  
* **Integration Type: Lambda Function**  
* **Region: Same Region**  
* **Lambda Function:  `postStudents` type**   
* **Click on create method** 

**Step 3: Enable CORS**

**In resources click on root i.e / then click on enable cors**

### 

### **Step 5: Deploy API**

**If we want that our application works it must be deployed**

**Actions → Deploy API**

* **Select a new stage**   
* **Stage name: `prod`**

**Your API endpoint :**

**`https://XXXXXXXX.execute-api.us-east-1.amazonaws.com/prod`**

**This url will invoke our lambda function**

## **5️⃣ CREATE S3 STATIC WEBSITE**

### **Step 1: Create S3 bucket**

* Bucket name: `studentdata-serverless-deployment-30jan`  
* Disable block public access  
* Click on Create Bucket   
* Upload the index.html and scripts.js    
* Enable static website hosting  
  * Index document: `index.html`  
  * Save Change 

* You will get 1 url but when you access you will get 403 access denied   
* We need to give a policy   
* Go  to AWS Policy Generator generate a policy for your bucket   
* Apply this /\* just after your resource like  **"Resource": "arn:aws:s3:::studentdata-serverless-deployment-30jan/\*"**  
* **Refresh the page now you will get the site**

**Now if we save the students data then we will get a message :** 

**Student Data Saved\!**

**Click on View all students and you will get the data of the saved students.**

**6️⃣ TESTING CHECKLIST**

* ✔ Save student → DynamoDB item created  
* ✔ View students → table populated  
* ✔ No CORS errors  
* ✔ No undefined values

 7️⃣ **Now we will configure with Cloudfront**

        **Why?**

[**http://studentdata-serverless-deployment-30jan.s3-website-us-east-1.amazonaws.com**](http://studentdata-serverless-deployment-30jan.s3-website-us-east-1.amazonaws.com)

**If we look at our S3 url then we come to  know that : it is using http in this case our bucket is exposed to the public which is not a good practice  so we need cloudfront.**

**What will happen when we use cloudfront?**

* **Users never access S3 directly**  
* **All traffic goes through CloudFront**  
* **HTTPS enforced**  
* **S3 access controlled**

### **Steps**

* **AWS Console → CloudFront**  
* **Choose a plan according to budget free (recommended)**  
* **Click Create Distribution**  
* **Choose: Web distribution (default)**  
* **Distribution Name: studentsData**  
* **Distribution Name: Single website or app**  
* **Origin type: S3**  
* **Choose S3 WEBSITE ENDPOINT, NOT S3 REST endpoint.**  
  **✅ Correct:**  
  **`studentdata-serverless-deployment-30jan.s3-website-us-east-1.amazonaws.com`**  
  **❌ Wrong:**  
  **`studentdata-serverless-deployment-30jan.s3.amazonaws.com`**  
* **Leave setting default and click next**  
* **Enable AWS WAF**   
* **Warning : WAF Will charge so enable wisely**   
* **Review and create**

**In a moment you will get a domain name like: [https://d24w9ih428mn84.cloudfront.net/](https://d24w9ih428mn84.cloudfront.net/)**

**Then access it using the same domain.**

<img width="1680" height="1050" alt="Screenshot 2026-01-31 at 3 26 51 PM" src="https://github.com/user-attachments/assets/581c4298-05d8-44a9-8c24-47b56cd034e4" />
