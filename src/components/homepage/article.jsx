import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import "./styles/submit.css";

const submit = (props) => {
	const { title, description, date, link } = props;

	return (
		<React.Fragment>
			<div className="homepage-submit">
				<div className="homepage-submit-content">
					<div className="homepage-submit-date">
						|&nbsp;&nbsp;&nbsp;{date}
					</div>
					<div className="homepage-submit-title">{title}</div>
					<div className="homepage-submit-description">
						{description}
					</div>
					<div className="homepage-submit-link">
						<Link to={link}>
							Read submit{" "}
							<FontAwesomeIcon
								style={{ fontSize: "10px" }}
								icon={faChevronRight}
							/>
						</Link>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default submit;
