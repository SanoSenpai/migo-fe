import React, { useState } from "react";
import { HiUserAdd } from "react-icons/hi";
import { useEffect } from "react";
import axios from "axios";
import {
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Select,
  Tag,
  Tooltip,
  useDisclosure,
  InputRightAddon,
} from "@chakra-ui/react";
import { useStateContext } from "../lib/context";
import { MdClose } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
const AddEmployeeForm = () => {
  const month = new Date().getMonth();
  const day = new Date().getDay();
  const year = new Date().getFullYear();
  console.log(month, day, year);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const [isPhoneValid, setIsPhoneValid] = useState(null);
  const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
    <div
      className="hover:opacity-60 transition-opacity duration-300"
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  ));
  const [phone, setPhone] = useState({ p: "" });
  const handleChangeTest = (e) => {
    const { value, name } = e.target;

    setPhone({ ...phone, [name]: value });
  };
  const [isAdded, setIsAdded] = useState(false);
  const { getEmployees, employees } = useStateContext();
  useEffect(() => {
    getEmployees();
  }, [isAdded]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  /*
		cn = contactNumber;
		ct = contractType; 
	*/

  const [add, setAdd] = useState({
    fn: "",
    mn: "",
    ln: "",
    ca: "",
    ccn: "", // city contact number
    pa: "", // provincial address
    pcn: "", //provincial contact number
    nod: "", //number of dependents
    cca: "", //civic club affiliation
    rel: "Roman Catholic", //religion
    bt: "A+", //bloodtype
    sex: "Male", //
    cs: "Single", //civil status
    bdate: "", //birthdate
    prof: "", //profession
    cn: "", // contact number
    email: "", //email
    yoe: "", //year of experience
    ct: "Regular", //contract type
    posApp: "",
    posCode: "",
    dj: "", //date joined
    en: "", //emergency name
    ea: "", //emergency address
    ercn: "", //emergency Residential contact number
    eocn: "", //emergency office contact number
    ecn: "", //emergency contact number
    er: "", //emergency relationship
  });
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const validatePhone = (phone) => {
    return String(phone).match(/9\d{9}$/);
  };

  const handleChange = async (e) => {
    const { value, name } = e.target;
    // let cnPattern = /\d{10}$/;
    // let cn = cnPattern.test(add.cn) ? add.cn : false;
    // if (cn == false)
    //   document.querySelector("#addEmployee").setAttribute("disabled", true);
    // else document.querySelector("#addEmployee").removeAttribute("disabled");

    setAdd({
      ...add,
      [name]: value,
    });
    if (name == "bdate") {
      setAdd({ ...add, [name]: value, age: calculateAge() });
    }
    if (name == "email") {
      validateEmail(value) ? setIsEmailValid(true) : setIsEmailValid(false);
    }
    if (
      name == "ccn" ||
      name == "cn" ||
      name == "pcn" ||
      name == "ercn" ||
      name == "eocn" ||
      name == "ecn"
    ) {
      let phone = value.slice(0, 10);
      setAdd({ ...add, [name]: phone });
      validatePhone(phone) ? setIsPhoneValid(true) : setIsPhoneValid(false);
      console.log(validatePhone(phone));
    }
  };
  function calculateAge() {
    let birthDate = new Date(add.bdate);
    let today = new Date();

    var years = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() == birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      years--;
    }

    return years;
  }
  const addEmployee = async (e) => {
    e.preventDefault();
    await getEmployees();
    // fn, mn, ln Uppercase first letter formatter
    let fn =
      add.fn.split(" ").length > 1
        ? add.fn
            .split(" ")
            .map((e) => {
              return `${e[0].toUpperCase()}${e.slice(1, e.length)}`;
            })
            .join(" ")
        : add.fn[0].toUpperCase() + add.fn.slice(1, add.fn.length);

    let mn =
      add.mn.split(" ").length > 1
        ? add.mn
            .split(" ")
            .map((e) => {
              return `${e[0].toUpperCase()}${e.slice(1, e.length)}`;
            })
            .join(" ")
        : add.mn[0].toUpperCase() + add.mn.slice(1, add.mn.length);

    let ln =
      add.ln.split(" ").length > 1
        ? add.ln
            .split(" ")
            .map((e) => {
              return `${e[0].toUpperCase()}${e.slice(1, e.length)}`;
            })
            .join(" ")
        : add.ln[0].toUpperCase() + add.ln.slice(1, add.ln.length);

    // data.LastName.split("").splice(0, 1).join("").toUpperCase() +
    // data.LastName.split("").splice(1, data.LastName.length).join("");

    axios({
      method: "post",
      url: "https://localhost:7241/Employee",
      data: {
        firstName: fn,
        middleName: mn,
        lastName: ln,
        cityAddress: add.ca,
        cityContactNumber: add.ccn,
        provincialAddress: add.pa,
        provincialContactNumber: add.pcn,
        numberOfDependents: add.nod,
        civicClubAffiliation: add.cca,
        religion: add.rel,
        bloodType: add.bt,
        age: add.age,
        sex: add.sex,
        civilStatus: add.cs,
        birthdate: add.bdate,
        profession: add.prof,
        contactNumber: add.cn,
        emailAddress: add.email,
        yearsOfExperience: add.yoe,
        contractType: add.ct,
        positionApplied: add.posApp,
        positionCode: add.posCode,
        dateJoined: add.dj,
        emergencyName: add.en,
        emergencyAddress: add.ea,
        emergencyResidentialContactNumber: add.ercn,
        emergencyOfficeContactNumber: add.eocn,
        emergencyContactNumber: add.ecn,
        emergencyRelationship: add.er,
      },
    });
    setIsAdded(!isAdded);
    onClose();
    await getEmployees();
    setAdd({
      fn: "",
      mn: "",
      ln: "",
      city: "", //city address
      ccn: "", // city contact number
      pa: "", // provincial address
      pcn: "", //provincial contact number
      nod: "", //number of dependents
      cca: "", //civic club affiliation
      rel: "", //religion
      bt: "", //bloodtype
      sex: "Male", //
      cs: "Single", //civil status
      bdate: "", //birthdate
      prof: "", //profession
      cn: "", // contact number
      email: "", //email
      yoe: "", //year of experience
      ct: "Regular", //contract type
      posApp: "",
      posCode: "",
      dj: "", //date joined
      en: "", //emergency name
      ea: "", //emergency address
      ercn: "", //emergency Residential contact number
      eocn: "", //emergency office contact number
      ecn: "", //emergency contact number
      er: "", //emergency relationship
    });
  };

  return (
    <div className="text-3xl cursor-pointer">
      <Tooltip placement="right" label="Add Employee">
        <CustomCard onClick={onOpen}>
          <HiUserAdd />
        </CustomCard>
      </Tooltip>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent padding={5}>
          <ModalHeader fontSize={50}>Add Employee</ModalHeader>

          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* name */}
            <h2 className=" pb-2 text-2xl font-semibold text-[#383838]">
              Personal Information
            </h2>
            <hr className=" pb-6" />
            <div className="flex flex-row gap-3">
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input
                  onChange={handleChange}
                  name="fn"
                  ref={initialRef}
                  placeholder="First name"
                  required={true}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Middle name</FormLabel>
                <Input
                  onChange={handleChange}
                  name="mn"
                  placeholder="Middle name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Last name</FormLabel>
                <Input
                  onChange={handleChange}
                  name="ln"
                  placeholder="Last name"
                />
              </FormControl>
            </div>

            <div className="flex flex-row gap-3 mt-4">
              <FormControl>
                <FormLabel>Birthdate</FormLabel>
                <Input
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  type="date"
                  name="bdate"
                  id=""
                />
              </FormControl>
              <FormControl>
                <FormLabel>Age</FormLabel>
                <Input disabled name="age" value={add.age} placeholder="Age" />
              </FormControl>
              <FormControl w={500}>
                <FormLabel>Sex</FormLabel>
                <Select
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  name="sex"
                  id=""
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>

              <FormControl w={600}>
                <FormLabel>Civil Status</FormLabel>
                <Select
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  name="cs"
                  id=""
                >
                  <option default value="Single">
                    Single
                  </option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widow">Widow</option>
                </Select>
              </FormControl>
              <FormControl width={"60%"}>
                <FormLabel>Blood Type</FormLabel>
                <Select
                  onChange={handleChange}
                  className="border px-3  rounded-lg w-full"
                  name="bt"
                  id=""
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </Select>
              </FormControl>
            </div>
            <FormControl mt={4} width={"50%"}>
              <FormLabel>Contact Number</FormLabel>

              <InputGroup>
                <InputLeftAddon children="+63" />
                <Input
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  name="cn"
                  id=""
                  maxLength={10}
                  value={add.cn}
                  type="number"
                  placeholder="9341563456"
                />
              </InputGroup>
            </FormControl>
            <div className="flex flex-row gap-3 mt-4">
              <FormControl>
                <FormLabel>City Address</FormLabel>
                <Input
                  onChange={handleChange}
                  name="ca"
                  placeholder="Unit 1, Brgy. 2, City, Province"
                />
              </FormControl>

              <FormControl>
                <FormLabel>City Contact Number</FormLabel>

                <InputGroup>
                  <InputLeftAddon children="+63" />
                  <Input
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-lg w-full"
                    name="ccn"
                    id=""
                    maxLength={10}
                    value={add.ccn}
                    type="number"
                    placeholder="9341563456"
                  />
                </InputGroup>
              </FormControl>
            </div>

            <div className="flex flex-row gap-3 mt-4">
              <FormControl>
                <FormLabel>Provincial Address</FormLabel>
                <Input
                  onChange={handleChange}
                  name="pa"
                  placeholder="Unit 1, Brgy. 2, City, Province"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Provincial Contact Number</FormLabel>

                <InputGroup>
                  <InputLeftAddon children="+63" />
                  <Input
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-lg w-full"
                    name="pcn"
                    id=""
                    maxLength={10}
                    value={add.pcn}
                    type="number"
                    placeholder="9341563456"
                  />
                </InputGroup>
              </FormControl>
            </div>

            <div className="flex flex-row gap-3 mt-4">
              <FormControl>
                <FormLabel>Email Address</FormLabel>

                <InputGroup>
                  <Input
                    focusBorderColor={
                      isEmailValid === null
                        ? ""
                        : isEmailValid === true || isEmailValid === false
                        ? isEmailValid
                          ? "green.500"
                          : "red.500"
                        : ""
                    }
                    isInvalid={
                      isEmailValid === null
                        ? ""
                        : isEmailValid === true || isEmailValid === false
                        ? isEmailValid
                          ? "green.500"
                          : "red.500"
                        : ""
                    }
                    errorBorderColor="red.300"
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-lg w-full"
                    type="email"
                    name="email"
                    id=""
                    placeholder="john.doe@gmail.com"
                  />
                  <InputRightElement
                    children={
                      isEmailValid === null ? (
                        ""
                      ) : isEmailValid === true || isEmailValid === false ? (
                        isEmailValid ? (
                          <div className="text-2xl text-green-500">
                            <BsCheck />
                          </div>
                        ) : (
                          <div className="text-2xl text-red-500">
                            <MdClose />
                          </div>
                        )
                      ) : (
                        ""
                      )
                    }
                  />
                </InputGroup>
                {isEmailValid === null ? (
                  ""
                ) : isEmailValid === true || isEmailValid === false ? (
                  isEmailValid ? (
                    ""
                  ) : (
                    <p className="text-red-500 text-xs pt-3">Invalid E-mail</p>
                  )
                ) : (
                  ""
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Contract Type</FormLabel>
                <Select
                  onChange={handleChange}
                  className="border px-3  rounded-lg w-full"
                  name="ct"
                  id=""
                >
                  <option value="Regular">Regular</option>
                  <option value="Part-time">Part-time</option>
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <FormControl width={"50%"}>
                <FormLabel>Number of Dependents</FormLabel>
                <Input
                  onChange={handleChange}
                  className=""
                  name="nod"
                  id=""
                  type="number"
                  placeholder="0"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Civic Club Affiliation</FormLabel>
                <Input
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  name="cca"
                  id=""
                  type="text"
                  placeholder="Civic"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Religion</FormLabel>
                <Select
                  onChange={handleChange}
                  className="border px-3  rounded-lg w-full"
                  name="rel"
                  id=""
                >
                  <option value="Roman Catholic">Roman Catholic</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Iglesia Ni Cristo">Iglesia Ni Cristo</option>
                  <option value="Protestant">Protestant</option>
                  <option value="Jehova's Witness">Jehova's Witness</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Agnostic">Agnostic</option>
                  <option value="Atheist">Atheist</option>
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <FormControl width={"40%"}>
                <FormLabel>Profession</FormLabel>
                <Input
                  onChange={handleChange}
                  name="prof"
                  placeholder="Information Technology"
                />
              </FormControl>
              <FormControl width={"30%"}>
                <FormLabel>Years of Experience</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    onChange={handleChange}
                    name="yoe"
                    placeholder="3"
                  />
                  <InputRightAddon children="years" />
                </InputGroup>
              </FormControl>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <FormControl>
                <FormLabel>Position Applied</FormLabel>
                <Input
                  onChange={handleChange}
                  name="posApp"
                  placeholder="Web Developer"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Position Code</FormLabel>
                <Input
                  onChange={handleChange}
                  name="posCode"
                  placeholder="I-69"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Date Joined</FormLabel>
                <input
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  type="date"
                  name="dj"
                  id=""
                />
              </FormControl>
            </div>
            <h2 className=" pt-10 pb-4 text-2xl font-semibold text-[#383838]">
              Emergency Contact
            </h2>
            <hr className=" pb-6" />
            <div className="flex flex-row gap-3 mt-4">
              <FormControl>
                <FormLabel>Emergency Name</FormLabel>
                <Input
                  type="number"
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  name="en"
                  id=""
                />
              </FormControl>
              <FormControl>
                <FormLabel>Emergency Address</FormLabel>
                <Input
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  name="ea"
                  id=""
                  placeholder="Unit 1, Brgy. 2, City, Province"
                />
              </FormControl>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <FormControl>
                <FormLabel>Emergency Residential Contact Number</FormLabel>

                <InputGroup>
                  <InputLeftAddon children="+63" />
                  <Input
                    type="number"
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-lg w-full"
                    name="ercn"
                    maxLength={10}
                    value={add.ercn}
                    id=""
                    placeholder="9123456789"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Emergency Residential Office Number</FormLabel>

                <InputGroup>
                  <InputLeftAddon children="+63" />
                  <Input
                    type="number"
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-lg w-full"
                    name="eocn"
                    maxLength={10}
                    value={add.eocn}
                    id=""
                    placeholder="9123456789"
                  />
                </InputGroup>
              </FormControl>
            </div>
            <div className="flex flex-row gap-3 mt-4">
              <FormControl>
                <FormLabel>Emergency Contact Number</FormLabel>

                <InputGroup>
                  <InputLeftAddon children="+63" />
                  <Input
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-lg w-full"
                    name="ecn"
                    maxLength={10}
                    value={add.ecn}
                    id=""
                    type="number"
                    placeholder="9123456789"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Emergency Relationship</FormLabel>
                <Input
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full"
                  name="er"
                  id=""
                  placeholder="Wife"
                />
              </FormControl>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              id={"addEmployee"}
              onClick={addEmployee}
              colorScheme="green"
              mr={3}
            >
              Add
            </Button>
            <Button id={"cancel"} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddEmployeeForm;
