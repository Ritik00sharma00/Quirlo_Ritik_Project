import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


// let fileArray=new Array({fileName:String,filetype:File.type,file:File,});


const UploadDocs =({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileError("");
      onFileUpload({ fileName: file.name, fileType: file.type, file: file }); // Call the parent handler
    } else {
      setSelectedFile(null);
      setFileError("Please choose a file");
    }
  };

  return (
    <Container>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="fileName" className="mb-3">
          <Form.Label>File Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={selectedFile ? selectedFile.name : ""}
            readOnly
          />
        </Form.Group>

        <Form.Group as={Col} controlId="fileType" className="mb-3">
          <Form.Label>Type of File</Form.Label>
          <Form.Control
            as="select"
            disabled={!selectedFile}
            value={selectedFile ? (selectedFile.type.includes("pdf") ? "pdf" : "image") : ""}
            onChange={() => {}}
          >
            <option value="">Select</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formFile" className="mb-3">
          <Form.Label>Upload File</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>

        {fileError && (
          <Col xs="12" className="text-danger mt-3">
            {fileError}
          </Col>
        )}
      </Row>
    </Container>
  );
};


const Mern_stack = () => {
  const [uploadedComponents, setUploadedComponents] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    street1: "",
    street2: "",
    permanentStreet1: "",
    permanentStreet2: "",
    uploadDocs: [],
  });


 
  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    street1: "",
    street2: "",
    permanentStreet1: "",
    permanentStreet2: "",
    uploadDocs: "",
  });

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleAdd = () => {
    setUploadedComponents([...uploadedComponents, <UploadDocs onFileUpload={handleFileUpload} />]);
  };

  const handleDelete = (index) => {
    const updatedComponents = uploadedComponents.filter((_, i) => i !== index);
    setUploadedComponents(updatedComponents);

    const updatedUploads = [...formData.uploadDocs];
    updatedUploads.splice(index, 1);
    setFormData({ ...formData, uploadDocs: updatedUploads });
  };

  const handleFileUpload = ({ fileName, fileType, file }) => {
    const newUploads = [...formData.uploadDocs, { fileName, fileType, file }];
    setFormData({ ...formData, uploadDocs: newUploads });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setFormData({
        ...formData,
        street1: formData.permanentStreet1,
        street2: formData.permanentStreet2,
      });
    } else {
      setFormData({
        ...formData,
        street1: "",
        street2: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let newErrors = {};
  
    if (formData.firstName.trim() === "") {
      newErrors.firstName = "Please provide your first name";
    }
  
    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Please provide your last name";
    }
  
    if (formData.email.trim() === "") {
      newErrors.email = "Please provide your email";
    }
  
    if (formData.dateOfBirth.trim() === "") {
      newErrors.dateOfBirth = "Please select your date of birth";
    } else {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        newErrors.dateOfBirth = "You must be 18 years or older";
      }
    }
  
    if (formData.street1.trim() === "") {
      newErrors.street1 = "Please fill in Street 1";
    }
  
    if (formData.street2.trim() === "") {
      newErrors.street2 = "Please fill in Street 2";
    }
  
    if (formData.permanentStreet1.trim() === "") {
      newErrors.permanentStreet1 = "Please fill in Permanent Street 1";
    }
  
    if (formData.permanentStreet2.trim() === "") {
      newErrors.permanentStreet2 = "Please fill in Permanent Street 2";
    }
  
    if (uploadedComponents.length < 2) {
      newErrors.uploadDocs = "Please upload at least 2 documents";
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
       
         await axios.post('http://localhost:3001/submit', formData);
  
       
        //  console.log('Response from server:', response.data);
  
      
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          street1: "",
          street2: "",
          permanentStreet1: "",
          permanentStreet2: "",
          uploadDocs: [],
        });
        setUploadedComponents([]);
  
      } catch (error) {
        
        console.error('Error while sending data:', error);
      }
    }
  };
  

  return (
    <Container style={{ padding: "5rem" }}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group as={Col} controlId="formGridfirstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your first name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                isInvalid={!!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Col} controlId="formGridlastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                isInvalid={!!errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group as={Col} controlId="formDate">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                isInvalid={!!errors.dateOfBirth}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dateOfBirth}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3 mt-3" controlId="formGridAddress1" required>
 
          <Row>
          <Form.Label>Residential Address</Form.Label>
            <Col>
              <Form.Label>Street 1</Form.Label>
              <Form.Control
                type="text"
                name="street1"
                value={formData.street1}
                onChange={handleChange}
                isInvalid={!!errors.street1}
              />
              <Form.Control.Feedback type="invalid">
                {errors.street1}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Street 2</Form.Label>
              <Form.Control
                type="text"
                name="street2"
                value={formData.street2}
                onChange={handleChange}
                isInvalid={!!errors.street2}
              />
              <Form.Control.Feedback type="invalid">
                {errors.street2}
              </Form.Control.Feedback>
            </Col>
          
           

          </Row>
        </Form.Group>
        <Form.Check
               type="checkbox"
               id="checkbox-example"
               label="Same as Residential addresses"
               checked={isChecked}
               onChange={handleCheckboxChange}
      />

        <Form.Group className="mb-3" controlId="formGridAddress1" required>

          <Form.Label>Permanent Address</Form.Label>
          <Row>
            <Col>
              <Form.Label>Street 1</Form.Label>
              <Form.Control
                type="text"
                name="permanentStreet1"
                value={formData.permanentStreet1}
                onChange={handleChange}
                isInvalid={!isChecked &&  !!errors.permanentStreet1}
                disabled={isChecked}
              />
              <Form.Control.Feedback type="invalid">
                {errors.permanentStreet1}
              </Form.Control.Feedback>
            </Col>
            <Col>
              <Form.Label>Street 2</Form.Label>
              <Form.Control
                type="text"
                name="permanentStreet2"
                value={formData.permanentStreet2}
                onChange={handleChange}
                isInvalid={ !isChecked && !!errors.permanentStreet2}
                disabled={isChecked}
              />
              <Form.Control.Feedback type="invalid">
                {errors.permanentStreet2}
              </Form.Control.Feedback>
            </Col>
          </Row>
        </Form.Group>

        <h3>Upload Documents</h3>
        <Row>
      
        {uploadedComponents.map((_, index) => (
            <Col key={index} xs="auto" className="d-flex align-items-center mt-3">
              <UploadDocs onFileUpload={handleFileUpload} />
              <Col xs="1" className="mb-3">
                <Button variant="light" onClick={() => handleDelete(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Col>
            </Col>
          ))}
          <Col xs="auto" className="d-flex align-items-center mb-2">
            <Button variant="primary" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
        </Row>
        
        {errors.uploadDocs && (
          <Form.Group as={Row} className="text-danger mt-3">
            <Col>
              <Form.Label>{errors.uploadDocs}</Form.Label>
            </Col>
          </Form.Group>
        )}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default Mern_stack;
