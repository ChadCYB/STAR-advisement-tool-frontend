import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { toSentenceCase } from "../../utils";

const SideTable = ({ data, type = "" }) => {
  console.log("data", data);
  const courseCodes = data
    ?.filter((course) => !course.selected_term.term)
    .map((course) => course.course_code);

  const coursesByTerm = data?.reduce((acc, course) => {
    const { term, year } = course.selected_term;
    if (!term) return acc;

    const key = `${toSentenceCase(term)} ${year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    const courseCodes = course.course_code;
    acc[key].push(courseCodes);
    return acc;
  }, {});

  return (
    <TableContainer component={Paper}>
      {type == "normal" ? (
        <Table>
          <TableBody>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell align="center">
                <strong>Transfer Courses</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">
                {courseCodes.map((code, index) => (
                  <React.Fragment key={index}>
                    <span>{code}</span>
                    {index !== courseCodes.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableBody>
            {Object.entries(coursesByTerm).map(([term, courses], index) => (
              <React.Fragment key={index}>
                <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableCell colSpan={2} align="center">
                    <strong>{term}</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">
                    {courses.map((course, index) => (
                      <React.Fragment key={index}>
                        <span>{course}</span>
                        {index !== courses.length - 1 && <br />}{" "}
                      </React.Fragment>
                    ))}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default SideTable;
