import { Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { selectAuth } from "../../redux/slice/auth";
import { axiosConfig } from "../../utils/helpers";

const UserViewDetails = () => {
	// Get id from params
	const { id } = useParams();
	// Redux
	const { user, accessToken, refreshToken } = useSelector(selectAuth);
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);

	// Title
	const title = `${data?.firstName} ${data?.lastName}`;

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Admin") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/user/details/${id}`,
					axiosConfig(accessToken, refreshToken)
				);

				if (data.success) {
					setData(data.data);
				}
			} catch ({ response: { data } }) {
				alert(data.message);
			}
		})();
	}, [accessToken, id, refreshToken]);

	if (!data) return <Loading />;

	const handleDelete = () => {};

	return (
		<>
			<h1 className="font-bold uppercase mb-8 text-2xl">
				View details: {title}
			</h1>

			<div className="flex items-center gap-4 mb-6">
				<Link to={`/users/${id}/update`}>
					<Button className="bg-[yellow]">Update</Button>
				</Link>
				<Button className="bg-[red] text-white" onClick={handleDelete}>
					Delete
				</Button>
			</div>

			<table className="view-details">
				<tbody>
					<tr>
						<th>First name</th>
						<td>{data?.firstName ? data?.firstName : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Last name</th>
						<td>{data?.lastName ? data?.lastName : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>{data?.email ? data?.email : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Phone</th>
						<td>{data?.phone ? data?.phone : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Role</th>
						<td>{data?.role ? data?.role : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Address</th>
						<td>{data?.address ? data?.address : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Bio</th>
						<td>{data?.bio ? data?.bio : <span>not set</span>}</td>
					</tr>

					<tr>
						<th>Logged in at</th>
						<td>
							{data?.loggedInAt ? data?.loggedInAt : <span>not set</span>}
						</td>
					</tr>
					<tr>
						<th>Logged in ip</th>
						<td>
							{data?.loggedInIP ? data?.loggedInIP : <span>not set</span>}
						</td>
					</tr>
				</tbody>
			</table>
		</>
	);
};

export default UserViewDetails;