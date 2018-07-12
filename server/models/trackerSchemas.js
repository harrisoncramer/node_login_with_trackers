const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const CourtCaseSchema = new mongoose.Schema({
  resource_uri: String,
  id: Number,
  court: String,
  clusters: Array,
  absolute_url: String,
  source: Number,
  appeal_from_str: String,
  assigned_to_str: String,
  referred_to_str: String,
  panel_str: String,
  date_created: String, // Date?
  date_modified: String,
  case_name_short: String,
  case_name: String,
  case_name_full: '',
  slug: String,
  docket_number: String,
  pacer_case_id: String,
  mdl_status: String
 }
);

const TwitterSchema = new mongoose.Schema({
        account: {
            type: String,
            required: true
        }
});

const LegislationSchema = new mongoose.Schema({
        legislation: {
            type: String,
            required: true
        }
});

module.exports = {
    CourtCaseSchema,
    TwitterSchema,
    LegislationSchema,
}