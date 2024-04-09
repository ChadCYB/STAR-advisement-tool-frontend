import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { getNextTerm, getTermLabel, toSentenceCase } from "../../utils";
import React from "react";
import "../../pages/CourseSelection/courseSelectionStyle.css";
import BlockModal from "../../components/BlockModal/BlockModal";
import Badge from "@mui/material/Badge";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
export const CourseSelection = () => {
  const course_types = [
    "upper_division",
    "lower_division",
    "general_education",
    "senior_design",
    "technical_elective",
  ];
  const blocks = [
    "block_c",
    "block_d",
    "block_a1",
    "block_a2",
    "us_constitution",
    "us_history",
    "block_e",
  ];

  const types = {
    upper_division: "Upper Division",
    lower_division: "Lower Division",
    general_education: "General Education",
    senior_design: "Senior Design",
    technical_elective: " Technical Elective",
  };
  const location = useLocation();

  const [termData, setTermData] = useState([]);
  const [courseListData, setCourseListData] = useState([]);

  const [checkboxResponses, setCheckboxResponses] = useState({});
  const navigate = useNavigate();
  const [navigationCount, setNavigationCount] = useState(0);
  const { courseList, startTerm, startYear } = location.state || {};
  console.log("startYearstartYear", startYear);
  //modal Changes
  const [genEduCourse, setGenEduCourse] = useState([]);
  const [currentTerm, setCurrentTerm] = useState(startTerm.value);
  const [currentYear, setCurrentYear] = useState(startYear);

  useEffect(() => {
    setCourseListData(courseList);
  }, []);

  useEffect(() => {
    console.log("currentYear", courseListData);

    const termCourseList = courseListData.filter((course) => {
      return course.term.includes(toSentenceCase(currentTerm));
    });

    const genEdu = courseListData.filter((course) => {
      return course.course_type === "general_education";
    });

    setGenEduCourse(genEdu);

    setTermData(termCourseList);
    console.log("Data : ", termCourseList);
  }, [courseList, currentTerm]);

  const handleCheckboxChange = (courseId, isChecked) => {
    setCheckboxResponses({ ...checkboxResponses, [courseId]: isChecked });
  };

  const handleNextClick = () => {
    setCurrentTerm(getNextTerm(currentTerm));
    setCurrentYear(currentTerm === "fall" ? currentYear + 1 : currentYear);
    let checkedCourses = courseListData.filter(
      (course) => checkboxResponses[course._id]
    );
    let existingCourses = localStorage.getItem("selectedCourses");
    existingCourses = existingCourses ? JSON.parse(existingCourses) : [];

    // // Include prerequisites of checked courses in localStorage
    // checkedCourses.forEach((course) => {
    //   course.pre_requisite.course_code.forEach((prerequisite) => {
    //     if (!existingCourses.some((c) => c._id === prerequisite)) {
    //       const prerequisiteCourse = courseList.find(
    //         (c) => c._id === prerequisite
    //       );
    //       if (prerequisiteCourse) {
    //         existingCourses.push(prerequisiteCourse);
    //       }
    //     }
    //   });
    // });

    checkedCourses = checkedCourses.map((course) => ({
      ...course,
      selected_term: { term: currentTerm, year: currentYear },
      startYear: startYear,
    }));

    let newCourses = [...existingCourses, ...checkedCourses];

    localStorage.setItem("selectedCourses", JSON.stringify(newCourses));

    console.log(localStorage.getItem("selectedCourses"));
    const filteredCourseList = courseListData.filter((course) => {
      return !newCourses.some((newCourse) => newCourse._id === course._id);
    });
    console.log("existingCourses>>>>>>", existingCourses);

    if (navigationCount < 5 && location.pathname !== "/course-selection") {
      console.log("NAVIGATED");
      // navigate("/course-selection", {
      //   state: {
      //     courseList: filteredCourseList,
      //     term: { term: currentTerm, year: currentYear },
      //     startTerm,
      //     startYear,
      //   },
      // });
      console.log("filteredCourseList", filteredCourseList);
      setCourseListData(filteredCourseList);
      setNavigationCount(navigationCount + 1);
    } else if (navigationCount >= 5) {
      navigate("/selected-courses", {
        state: {
          courseList: filteredCourseList,
          startTerm,
          startYear,
          endTerm: currentTerm,
          endYear: currentYear,
        },
      });
    }
  };
  console.log("termData", termData);
  return (
    <Box sx={{ textAlign: "center" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding={3}
      >
        <Typography variant="h4" component="div">
          {getTermLabel(currentTerm)} {currentYear}
        </Typography>
        <Box>
          <Button variant="contained" onClick={handleNextClick}>
            Next
          </Button>
        </Box>
      </Stack>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {course_types.map((header) => {
            const isGeneralEducation = header === "general_education";

            let coursesForType = isGeneralEducation
              ? genEduCourse
              : termData.filter((course) => course.course_type === header);

            const coursesToShow = isGeneralEducation
              ? blocks
                  .filter((block) =>
                    coursesForType.some((course) => course.block_type === block)
                  )
                  .map((block) => ({
                    block,
                    courses: coursesForType.filter(
                      (course) => course.block_type === block
                    ),
                  }))
              : [{ courses: coursesForType }];

            if (coursesToShow.some(({ courses }) => courses.length > 0)) {
              return (
                <div key={header}>
                  <div className="course_type">
                    <h1>{types[header]}</h1>
                  </div>
                  <Grid container spacing={5} style={{ padding: 20 }}>
                    {isGeneralEducation
                      ? coursesToShow.map(({ block, courses }) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            spacing={5}
                            key={courses._id}
                            style={{ marginLeft: -45, marginRight: 40 }}
                          >
                            <Badge
                              badgeContent={
                                <DoneOutlinedIcon
                                  fontSize="large"
                                  color="success"
                                />
                              }
                              invisible={
                                !courses.some(
                                  (course) => checkboxResponses[course._id]
                                )
                              }
                            >
                              <BlockModal
                                key={block}
                                enableCheckbox
                                data={courses}
                                block={block}
                                handleCheckboxChange={handleCheckboxChange}
                                checkboxResponses={checkboxResponses}
                              />
                            </Badge>
                          </Grid>
                        ))
                      : coursesToShow[0].courses.map((course) => {
                          const selectedCourses = JSON.parse(
                            localStorage.getItem("selectedCourses")
                          );

                          const prerequisitesPresent =
                            course.pre_requisite.course_code.every(
                              (prerequisite) => {
                                return selectedCourses.some((selectedCourse) =>
                                  selectedCourse.course_code.includes(
                                    prerequisite
                                  )
                                );
                              }
                            );

                          return (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={4}
                              key={course._id}
                            >
                              <CourseCard
                                enableCheckbox={prerequisitesPresent}
                                requsiteRequired={!prerequisitesPresent}
                                hoverable={true}
                                course={course}
                                onCheckboxChange={(isChecked) =>
                                  handleCheckboxChange(course._id, isChecked)
                                }
                              />
                            </Grid>
                          );
                        })}
                  </Grid>
                </div>
              );
            } else {
              return null;
            }
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default CourseSelection;
