import moment from "moment/moment.js";
import validate from "validate.js";
import { formatDateOnly, formatDateTime } from "../constants.js";

const validateDatetime = () => {
	validate.extend(validate.validators.datetime, {
		// The value is guaranteed not to be null or undefined but otherwise it
		// could be anything.
		parse: function (value) {
			return moment.utc(value, formatDateTime).valueOf();
		},
		// Input is a unix timestamp
		format: function (value, options) {
			const format = options.datetime ? formatDateTime : formatDateOnly;
			return moment.utc(value).format(format);
		},
	});
};

export default validateDatetime;