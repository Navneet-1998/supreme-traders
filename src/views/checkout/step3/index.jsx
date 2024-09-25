import React, { useState, useEffect } from "react";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Formik, Form } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropTypes from "prop-types";
import { Redirect, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import Total from "./Total";
import scanner from "../../../payment/scanner";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { clearBasket } from '../../../redux/actions/basketActions';
import { BasketItem, BasketToggle } from '../../../components/basket';
import firebaseInstance from "../../../services/firebase";

// Modal styles
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "60%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 6,

};

// Modal component
const BasicModal = ({ isOpen, handleClose }) => (
  <Modal
    open={isOpen}
    onClose={handleClose}
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <Box sx={modalStyle} >
      <Typography id="modal-title" variant="h6" component="h2" style={{fontSize:"18px"}}>
        Thank you for Shopping!
      </Typography>
      <Typography id="modal-description" sx={{ mt: 2 }} style={{fontSize:"14px"}}>
        Your order will be placed once the payment is confirmed.
      </Typography>
      <Button onClick={handleClose} style={{fontSize:"18px", marginTop:"2%"}}>Back to Home</Button>
    </Box>
  </Modal>
);


const BpIcon = styled("span")(({ theme }) => ({

  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: "#f5f8fa",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#ebf1f5",
    ...theme.applyStyles("dark", {
      backgroundColor: "#30404d",
    }),
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "rgba(206,217,224,.5)",
    ...theme.applyStyles("dark", {
      background: "rgba(57,75,89,.5)",
    }),
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 0 1px rgb(16 22 26 / 40%)",
    backgroundColor: "#394b59",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))",
  }),
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

// Custom checkbox component
function BpCheckbox(props) {
  return (
    <Checkbox
      sx={{ "&:hover": { bgcolor: "transparent" } }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      {...props}
    />
  );
}

// Image modal component
const ImageModal = ({ imageUrl, altText, isOpen, closeModal }) => (
  <>
    {isOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>
            close
          </span>
          <img src={imageUrl} alt={altText} style={{ maxWidth: "80%" }} />
        </div>
      </div>
    )}
  </>
);
// Form validation schema
const FormSchema = Yup.object().shape({
  utr: Yup.string()
    .length(12, "UTR Number should have exactly 12 characters.")
    .required("UTR Number is required"),
});

// Payment component
const Payment = ({ shipping, subtotal }) => {
  useDocumentTitle("Check Out Final Step | Supreme");
  useScrollTop();



const { basket, user } = useSelector((state) => ({
  basket: state.basket,
  user: state.auth
}));

  const history = useHistory();
  const dispatch = useDispatch();
  console.log(shipping)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [paymentModel, setPaymentModel] = useState(false)

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedImage(value);
    } else {
      setSelectedImage(null);
    }
  };

  const openModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const addItemToBasket = (item, userId) => {
    // Fetch the current basket items
    firebaseInstance.getUser(userId).then((userDoc) => {
        console.log(userDoc.data());
        
        // Use optional chaining and nullish coalescing to handle potential undefined values
        const currentBasket = userDoc.data()?.basket ?? [];

        // Get the current date and time
        const date = new Date(); 
        const customFormattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const customFormattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

        // Add date and time to each item
        const updatedItems = item.map(e => ({
            ...e,
            date: customFormattedDate,
            time: customFormattedTime
        }));

        // Add the new items to the basket
        const updatedBasket = [...currentBasket, ...updatedItems];

        // Save the updated basket to Firestore
        firebaseInstance
            .saveBasketItems(updatedBasket, userId)
            .then(() => {
                console.log("Basket updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating basket: ", error);
            });
    }).catch(error => {
        console.error("Error fetching user data: ", error);
    });
};


  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleClose2 = () => {
    setPaymentModel(false);
    dispatch(clearBasket())
    history.push("/");
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }


  useEffect(() => {
    console.log(basket,user)
  },[])

  return (
    <div className="checkout">
      <StepTracker current={3} />

      <Formik
        initialValues={{ utr: ""}}
        validationSchema={FormSchema}
        onSubmit={(values, { resetForm }) => {
          const formData = {
            utr: values.utr,
            upi_id: selectedImage,
            amount: subtotal,
            customer_details : {
              address : shipping.address,
              email :  shipping.email,
              fullname : shipping.fullname,
              mobile_no : `+${shipping.mobile.value}`,
            }
          };

          fetch("https://formspree.io/f/mgvwjnqw", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
            .then((response) => {
              if (response.ok) {
                displayActionMessage("Email sent successfully!", "success");
                if (user && user.id) {
                  addItemToBasket(basket, user.id);
                 console.log('Basket items saved to Firestore'); // Remove the extra semicolon here
               }
                setPaymentModel(true);
              } else {
                displayActionMessage("Error sending email. Please try again later.", "error");
              }
            })
            .catch((error) => {
              displayActionMessage("An error occurred while sending email.", "error");
            });
        }}
      >
        {({ handleChange, values, touched, handleBlur, handleSubmit, errors }) => (
          <Form className="checkout-step-3" onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {scanner.map((item, index) => (
                <div key={index} style={{ width: "20%", margin: "0 5% 2% 0" }}>
                  <label>
                    <BpCheckbox
                      checked={selectedImage === item.label}
                      onChange={(event) => handleCheckboxChange(event, item.label)}
                      disabled={selectedImage && selectedImage !== item.label}
                    />
                    <button type="button" onClick={() => openModal(item.value)}  disabled={selectedImage && selectedImage !== item.label}>
                      <img src={item.value} alt={`scanner-${index}`} style={{ width: "100%", height: "100%" }} />
                    </button>
                    <p style={{ textAlign: "center" }}>{item.label}</p>
                  </label>
                </div>
              ))}
              {errors.upi_id && touched.upi_id && (
                <p className="form-error" style={{ color: "#5f5e5e" }}>{errors.upi_id}</p>
              )}
            </div>

            <div style={{ marginTop: "2%" }}>
              <label htmlFor="utr" style={{ display: "block", width: "40%", marginBottom: "1%" }}>
                Please Enter UTR Number
              </label>
              <input
                type="text"
                id="utr"
                className="form-control"
                placeholder="Please Enter 12 digit UTR Number"
                value={values.utr}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ width: "40%" }}
              />
              {errors.utr && touched.utr && (
                <p className="form-error" style={{ color: "#5f5e5e" }}>{errors.utr}</p>
              )}
            </div>

            <Total isInternational={shipping.isInternational} subtotal={subtotal} />
            <BasicModal isOpen={paymentModel} handleClose={handleClose2} />
            <ImageModal
                imageUrl={modalImageUrl}
                altText="Sample Image"
                isOpen={isModalOpen}
                closeModal={handleClose}
              />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropTypes.shape({
    isDone: PropTypes.bool.isRequired,
    isInternational: PropTypes.bool.isRequired,
  }).isRequired,
  subtotal: PropTypes.number.isRequired,
};

export default withCheckout(Payment);
