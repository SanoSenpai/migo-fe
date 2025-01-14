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

import { useRef } from "react";
import toast from "react-hot-toast";
import { position } from "../../utils/position";
import ContactNumber from "./ContactNumber";
import EmailInput from "./EmailInput";
import def from "../assets/default.png";
const AddEmployeeForm = () => {
	const month = new Date().getMonth();
	const day = new Date().getDay();
	const year = new Date().getFullYear();
	const [pic, setPic] = useState();
	const [isPicSelected, setIsPicSelected] = useState(false);

	const [isEmailValid, setIsEmailValid] = useState(null);
	const [isPhoneValid, setIsPhoneValid] = useState({
		cn: null,
		ccn: null,
		ecn: null,
	});
	const { getEmployees } = useStateContext();
	const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
		<div
			className="hover:opacity-60 transition-opacity duration-300"
			ref={ref}
			{...rest}
		>
			{children}
		</div>
	));

	const [isAdded, setIsAdded] = useState(false);
	const [selectedPosition, setSelectedPosition] = useState(position[0]);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const initialRef = React.useRef(null);
	const finalRef = React.useRef(null);
	let poscode;
	var curr = new Date();
	curr.setFullYear(curr.getFullYear() - 22);
	var date = curr.toISOString().substring(0, 10);
	var now = new Date();
	var nowString = now.toISOString().substring(0, 10);
	const [add, setAdd] = useState({
		fn: "",
		mn: "",
		ln: "",
		ca: "",
		ccn: "", // city contact number
		nod: "", //number of dependents
		cca: "", //civic club affiliation
		rel: "Roman Catholic", //religion
		bt: "A+", //bloodtype
		sex: "Male", //
		cs: "Single", //civil status
		age: 22,
		bdate: date, //birthdate
		prof: "Information Technology", //profession
		cn: "", // contact number
		email: "", //email
		yoe: "", //year of experience
		ct: "Regular", //contract type
		posApp: "Senior Back-end Developer",
		posCode: "",
		dj: "", //date joined
		en: "", //emergency name
		ea: "", //emergency address
		ecn: "", //emergency contact number
		er: "", //emergency relationship
		in: "", //image name
		is: "", //image source
		if: "", //image file
		e: ""
	});
	// const changeHandler = (e) =>{
	// 	let imageFile = e.target.files[0]
	// 	const reader = new FileReader()
	// 	reader.onload = x =>{
	// 		setAdd({
	// 			...add,
	// 			in: "",
	// 			is: x.target.result,
	// 			if: imageFile
	// 		}),
	// 			setPic(x.target.result)
	// 		console.log(add)
	// 	}
	// 	reader.readAsDataURL(imageFile)
	// 	setIsPicSelected(true)
	// 	}

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
	useEffect(() => {
		poscode = position.find((e) => e.name === add.posApp);

		setAdd({ ...add, posCode: poscode ? poscode.code : "" });
	}, [add.posApp]);
	const handleChange = async (e) => {
		const { value, name } = e.target;
		setAdd({
			...add,
			[name]: value,
		});
		if (name == "bdate") {
			setAdd({ ...add, [name]: value, age: calculateAge() });
		}

		if (name == "email") {
			if (value.length > 0) {
				validateEmail(value) ? setIsEmailValid(true) : setIsEmailValid(false);
			} else {
				setIsEmailValid(null);
			}
		}
		if (name == "ccn" || name == "cn" || name == "ecn") {
			let phone = value.slice(0, 10);
			setAdd({ ...add, [name]: phone });
			if (value.length > 0) {
				validatePhone(phone)
					? setIsPhoneValid({ ...isPhoneValid, [name]: true })
					: setIsPhoneValid({ ...isPhoneValid, [name]: false });
			} else {
				setIsPhoneValid({ ...isPhoneValid, [name]: null });
			}
			// console.log(validatePhone(phone));
		}
		if (name == "image") {
			console.log(value);
			let imageFile = e.target.files[0];
			console.log(value);
			const reader = new FileReader();
			reader.onload = (x) => {
				setAdd({
					...add,
					in: "",
					is: x.target.result,
					if: imageFile,
				}),
				setPic(x.target.result);
				console.log(x.target.result);
			};
			// console.log(add)
			reader.readAsDataURL(imageFile);
			setIsPicSelected(true);
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

	const validate = useRef();
	const [isFormValid, setIsFormValid] = useState(false);
	useEffect(() => {
		let allPhone = [];
		let allPhoneValid = false;
		let allFields = [];
		let allFieldsFilled = false;
		for (const [key, value] of Object.entries(isPhoneValid)) {
			allPhone.push(value);
		}
		for (const [key, value] of Object.entries(add)) {
			allFields.push(
				value
					? true
					: (key == "cca" && value == "") ||
					  (key == "cca" && value == null) ||
					  (key == "in" && value == null) ||
					  (key == "in" && value == "")
					? true
					: false
			);
		}

		allPhone.every((e) => e === true)
			? (allPhoneValid = true)
			: (allPhone = []);

		allFields.every((e) => e === true)
			? (allFieldsFilled = true)
			: (allFields = []);
		allPhoneValid && isEmailValid && allFieldsFilled
			? setIsFormValid(true)
			: setIsFormValid(false);

		// console.log(allFields);
		// console.info(`allfields: ${allFieldsFilled}`);
		// console.log(`all field: ${isEmailValid}`);
		// console.log(`allphone: ${allPhoneValid}`);
	}, [isPhoneValid, add, isEmailValid]);
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
		const url = "https://localhost:7241/Employee";
		let formData = new FormData();
		formData.append("firstName", fn);
		formData.append("middleName", mn);
		formData.append("lastName", ln);
		formData.append("cityAddress", add.ca);
		formData.append("cityContactNumber", add.ccn);
		formData.append("numberOfDependents", add.nod);
		formData.append("civicClubAffiliation", add.cca);
		formData.append("religion", add.rel);
		formData.append("bloodType", add.bt);
		formData.append("age", add.age);
		formData.append("sex", add.sex);
		formData.append("civilStatus", add.cs);
		formData.append("birthdate", add.bdate);
		formData.append("profession", add.prof);
		formData.append("contactNumber", add.cn);
		formData.append("emailAddress", add.email);
		formData.append("yearsOfExperience", add.yoe);
		formData.append("contractType", add.ct);
		formData.append("positionApplied", add.posApp);
		formData.append("positionCode", add.posCode);
		formData.append("dateJoined", add.dj);
		formData.append("emergencyName", add.en);
		formData.append("emergencyAddress", add.ea);
		formData.append("status", true);
		formData.append("emergencyContactNumber", add.ecn);
		formData.append("emergencyRelationship", add.er);
		formData.append("imageName", "");
		formData.append("imageSrc", "");
		formData.append("imageFile", add.if);
		formData.append("evaluated", false);

		try {
			const res = await fetch(url, {
				method: "post",
				body: formData,
			});
			const data = await res.json();
			console.log(res);
			console.log(data);
		} catch (e) {
			console.log(e);
		}

		setIsAdded(!isAdded);
		onClose();

		setAdd({
			fn: "",
			mn: "",
			ln: "",
			ca: "",
			ccn: "", // city contact number
			nod: "", //number of dependents
			cca: "", //civic club affiliation
			rel: "Roman Catholic", //religion
			bt: "A+", //bloodtype
			sex: "Male", //
			cs: "Single", //civil status
			age: 22,
			bdate: date, //birthdate
			prof: "Information Technology", //profession
			cn: "", // contact number
			email: "", //email
			yoe: "", //year of experience
			ct: "Regular", //contract type
			posApp: "Senior Back-end Developer",
			posCode: "",
			dj: "", //date joined
			en: "", //emergency name
			ea: "", //emergency address
			ecn: "", //emergency contact number
			er: "", //emergency relationship
			in: "", //image name
			is: "", //image source
			if: "", //image file
		});
		setPic("");
		setIsPicSelected(false);
		setIsPhoneValid({
			cn: null,
			ccn: null,
			pcn: null,
			ecn: null,
			eocn: null,
			ercn: null,
		});
		setIsEmailValid(null);
		toast({
			title: "Employee added.",
			description: `successfully added!`,
			status: "success",
			duration: 9000,
			isClosable: true,
		});
		await getEmployees();
	};
	const validateAge = () => {
		var bd = new Date(add.bdate).getFullYear();
		return bd < curr.getFullYear() - 80 || bd > curr.getFullYear()
			? false
			: true;
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
					<ModalHeader>
						<div className="flex justify-between items-center">
							<p className="text-[50px]">Add Employee</p>
							<div className="flex flex-col items-center">
								{/* <img className="absolute -z-10 left-0" src={dhbg} alt="" /> */}
								{isPicSelected && pic != undefined ? (
									<label>
										<div className="overflow-hidden flex justify-center w-28 h-28 rounded-full">
											<img
												src={pic}
												className="mb-[-1rem] hover:opacity-40 cursor-pointer object-cover"
											/>
										</div>
										<input
											type={"file"}
											name="image"
											accept="image/*"
											onChange={handleChange}
											hidden
										></input>
									</label>
								) : (
									<label>
										<img
											src={def}
											width={90}
											className="mb-[-1rem] hover:opacity-40 cursor-pointer"
										/>
										<input
											type={"file"}
											name="image"
											accept="image/*"
											onChange={handleChange}
											hidden
										></input>
									</label>
								)}
								<p className="mt-5 text-sm">Employee Photo</p>
							</div>
						</div>
					</ModalHeader>

					<ModalCloseButton />
					<ModalBody pb={6}>
						<form autoComplete="off">
							{/* name */}
							<h2 className=" pb-2 text-2xl font-semibold text-[#383838]">
								Personal Information
							</h2>
							<hr className=" pb-6" />
							<div>
								<div>
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
												max={date}
												id=""
												defaultValue={date}
											/>
										</FormControl>
										<FormControl>
											<FormLabel>Age</FormLabel>
											<Input
												name="age"
												disabled
												value={
													validateAge()
														? calculateAge(add.bdate)
														: "Invalid Date"
												}
												placeholder="Age"
											/>
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
								</div>
							</div>
							<div className="flex gap-3 mt-4">
								<ContactNumber
									label={"Contact Number"}
									w={"49.5%"}
									addname={"cn"}
									handleChange={handleChange}
									val={add.cn}
									isPhoneValid={isPhoneValid.cn}
								/>
							</div>
							<div className="flex flex-row gap-3 mt-4">
								<FormControl>
									<FormLabel>City Address</FormLabel>
									<Input
										onChange={handleChange}
										name="ca"
										placeholder="Unit 1, Brgy. 2, City, Province"
									/>
								</FormControl>

								<ContactNumber
									label={"City Contact Number"}
									w={"100%"}
									addname={"ccn"}
									handleChange={handleChange}
									val={add.ccn}
									isPhoneValid={isPhoneValid.ccn}
								/>
							</div>

							<div className="flex flex-row gap-3 mt-4">
								<EmailInput
									value={add.email}
									isEmailValid={isEmailValid}
									handleChange={handleChange}
								/>

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
									<FormLabel>Civic Club Affiliation </FormLabel>
									<Input
										onChange={handleChange}
										className="border px-3 py-2 rounded-lg w-full"
										name="cca"
										id=""
										type="text"
										placeholder="Optional"
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
										<option value="Other">Prefer not to say</option>
									</Select>
								</FormControl>
							</div>
							<div className="flex flex-row gap-3 mt-4">
								<FormControl width={"40%"}>
									<FormLabel>Profession</FormLabel>
									<Select
										onChange={handleChange}
										className="border px-3  rounded-lg w-full"
										name="prof"
										id=""
									>
										<option value="Information Technology">
											Information Technology
										</option>
										<option value="Cyber Security">Cyber Security</option>
										<option value="Computer Science">Computer Science</option>
										<option value="Data Analyst">Data Analyst</option>
									</Select>
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
									<Select
										onChange={handleChange}
										className="border px-3  rounded-lg w-full"
										name="posApp"
										id=""
										value={add.posApp}
									>
										{position.map((e, i) => {
											return (
												<option key={i} value={e.name}>
													{e.name}
												</option>
											);
										})}
									</Select>
								</FormControl>
								<FormControl>
									<FormLabel>Position Code</FormLabel>
									<Input
										onChange={handleChange}
										name="posCode"
										placeholder=""
										disabled
										value={add.posCode}
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
										max={nowString}
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
										placeholder="John S. Doe"
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
								<ContactNumber
									label={"Emergency Contact Number"}
									w={"100%"}
									addname={"ecn"}
									handleChange={handleChange}
									val={add.ecn}
									isPhoneValid={isPhoneValid.ecn}
								/>
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
						</form>
					</ModalBody>

					<ModalFooter>
						<button
							className={`font-semibold px-5 mr-3 py-2 rounded-lg transition-all duration-300 
							bg-green-400 hover:opacity-80  text-[#353535] `}
							id={"addEmployee"}
							onClick={addEmployee}
							mr={3}
							ref={validate}
						>
							Add
						</button>
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
