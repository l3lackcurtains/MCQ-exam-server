# **Medical app  Rest API Documentation**


### [+] User

##### **1) /api/register**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **email:** *
   `Email Address of user`

   **password:** *
   `Password of user`

   **firstname:** *
   `Firstname of user`

   **lastname:** *
   `Lastname of user`

   **profilePhoto**
   `Profile Image of user (url)`

* **Response**

  ```json
  {
      "success": true,
      "message": "A verification email has been sent to user@example.com"
  }
  ```

##### **2) /api/verification**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **token:** *
   `Last hash code from URL received in email http://example.com/verification/[hash-code]`

* **Response**

  ```json
  {
      "success": true,
      "message": "User verified successfully."
  }
  ```


##### **3) /api/resend-verification**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **email:** *
   `Email Address of user`

* **Response**

  ```json
  {
    "success": true,
    "message": "A verification email has been sent user@example.com"
  }
  ```
  
##### **4) /api/authenticate**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **email:** *
   `Email Address of user`

  **password:** *
   `Password of user`

* **Response**

  ```json
  {
      "success": true,
      "token": "JWT [Token]"
  }
  ```

##### **5) /api/ask-reset-password**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **email:** *
   `Email Address of user`

* **Response**

  ```json
  {
      "success": true,
      "message": "An email to reset password has been sent to user@example.com"
  }
  ```

##### **6) /api/reset-password**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **password:** *
   `Password of user`
  
  **token:** *
   `Last hash code from URL received in email http://example.com/reset-password/[hash-code]`

* **Response**

  ```json
  {
      "success": true,
      "message": "Password changed successfully."
  }
  ```

### [+] Image

#### **1) /api/upload-image**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **image:** *
   `Image from form <Image Filetype> (jpg, png, JPG, jpeg, gif)`


* **Response**

  ```json
  {
      "success": true,
      "message": "Image successfully uploaded",
      "file": "<Image Info>"
  }
  ```

### [+] Study

#### **1) /api/study**

* **Method:**
  
  `GET`
  
*  **URL Params**

    **page:** *
   `Page Number`

   **limit:** *
   `Limited Number of result in each page`

   **sortBy:** *
   `Body Parameter Name to sort by`

   **order:** *
   `1 for Ascending and -1 for Descending`

   **fields:** *
   `fetch only fields. format: 'field1,field2,field3'`

   **[Body Parameter]:** *
   `Value of body parameter to filter results`

* **Body Data**

    _None_


* **Response**

  ```json
  {
      "success": true,
      "message": "Studies successfully fetched.",
      "data": {
          "docs": "[<Results>]",
          "total": "<Total results>",
          "limit": "<Limit>",
          "page": "<Page>",
          "pages": "<Total Pages>",
      }
  }
  ```

#### **2) /api/study/:id**

* **Method:**
  
  `GET`
  
*  **URL Params**

   **fields:** *
   `fetch only fields. format: 'field1,field2,field3'`

* **Body Data**

    _None_


* **Response**

  ```json
  {
      "success": true,
      "message": "Study successfully fetched.",
      "data": "<Result>"
  }
  ```
#### **3) /api/study**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **question:** *
   `Question of study`

   **answers:** *
   `Array - Answers as array of string`

   **imageUrl:** *
   `Url of question image`

   **category:** *
   `Category of study`

   **subCategory:** *
   `subcategory of study`


* **Response**

  ```json
  {
    "success": true,
    "message": "Study successfully Posted.",
    "data": "<study data>"
  }
  ```

#### **4) /api/study/:id**

* **Method:**
  
  `PUT`
  
*  **URL Params**

    _None_

* **Body Data**

  **question:** *
   `Question of study`

   **answers:** *
   `Array - Answers as array of string`

   **imageUrl:** *
   `Url of question image`

   **category:** *
   `Category of study`

   **subCategory:** *
   `subcategory of study`


* **Response**

  ```json
  {
    "success": true,
    "message": "Study updated successfully.",
    "data": "<study data>"
  }
  ```

#### **5) /api/study/:id**

* **Method:**
  
  `DELETE`
  
*  **URL Params**

    _None_

* **Body Data**

  _None_

* **Response**

  ```json
  {
    "success": true,
    "message": "Study deleted successfully.",
  }
  ```
### [+] Mcq

#### **1) /api/mcq**

* **Method:**
  
  `GET`
  
*  **URL Params**

    **page:** *
   `Page Number`

   **limit:** *
   `Limited Number of result in each page`

   **sortBy:** *
   `Body Parameter Name to sort by`

   **order:** *
   `1 for Ascending and -1 for Descending`

   **fields:** *
   `fetch only fields. format: 'field1,field2,field3'`

   **[Body Parameter]:** *
   `Value of body parameter to filter results`

* **Body Data**

    _None_


* **Response**

  ```json
  {
      "success": true,
      "message": "Mcqs successfully fetched.",
      "data": {
          "docs": "[<Results>]",
          "total": "<Total results>",
          "limit": "<Limit>",
          "page": "<Page>",
          "pages": "<Total Pages>",
      }
  }
  ```

#### **2) /api/mcq/:id**

* **Method:**
  
  `GET`
  
*  **URL Params**

   **fields:** *
   `fetch only fields. format: 'field1,field2,field3'`

* **Body Data**

    _None_


* **Response**

  ```json
  {
      "success": true,
      "message": "Mcq successfully fetched.",
      "data": "<Result>"
  }
  ```

#### **3) /api/mcq**

* **Method:**
  
  `POST`
  
*  **URL Params**

    _None_

* **Body Data**

  **question:** *
   `Question of study`

   **rightAnswer:** *
   `Right Answer`

   **rightAnswerDesc:** *
   `Description of right answer`

   **wrongAnswers:** *
   `Wrong answers in array of string`

   **imageUrl:** *
   `Url of question image`

   **category:** *
   `Category of study`

   **subCategory:** *
   `subcategory of study`


* **Response**

  ```json
  {
    "success": true,
    "message": "mcq successfully Posted.",
    "data": "<Mcq data>"
  }
  ```

#### **4) /api/mcq/:id**

* **Method:**
  
  `PUT`
  
*  **URL Params**

    _None_

* **Body Data**

  **question:** *
   `Question of study`

   **rightAnswer:** *
   `Right Answer`

   **rightAnswerDesc:** *
   `Description of right answer`

   **wrongAnswers:** *
   `Wrong answers in array of string`

   **imageUrl:** *
   `Url of question image`

   **category:** *
   `Category of study`

   **subCategory:** *
   `subcategory of study`


* **Response**

  ```json
  {
    "success": true,
    "message": "Mcq updated successfully.",
    "data": "<mcq data>"
  }
  ```

#### **5) /api/mcq/:id**

* **Method:**
  
  `DELETE`
  
*  **URL Params**

    _None_

* **Body Data**

  _None_

* **Response**

  ```json
  {
    "success": true,
    "message": "Mcq deleted successfully.",
  }
  ```
  