import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";

const Transaction = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const { user } = useSelector(selectAuth);

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	return <div>Transaction</div>;
};

export default Transaction;