import AddJobDialog from "@/src/components/add-job";
import JobBarTile from "@/src/components/jobTitle";
import Navbar from "@/src/components/Navbar";
import { Container, Box } from "@mui/material";

// const dummyDrives = [
//   { company: "Google", role: "SDE", deadline: "2025-06-15" },
//   { company: "Microsoft", role: "Intern", deadline: "2025-06-20" },
// ];

export default function HomePage() {
  return (
    <Container>
      <Box>
        <Navbar />
      </Box>
      <Box mt={"10px"}>
        <AddJobDialog />
      </Box>
      <Box sx={{ mt: "10px" }}>
        <JobBarTile
          companyName="Google"
          jobTitle="SDE Intern"
          jobType="IT"
          branchEligible={["CSE", "ECE"]}
          courseEligible={["B.Tech", "M.Tech"]}
          minCGPA={8.0}
          minClass10={85}
          minClass12={90}
          deadline="2025-07-01"
          opportunityType="Internship"
          bond="No Bond"
          stipend="80000"
          package="45"
          jobId="google-sde-2025"
          jobDescriptionLink="https://drive.google.com/example"
          remarks="Only for final year students"
        />
        <JobBarTile
          companyName="Google"
          jobTitle="SDE Intern"
          jobType="IT"
          branchEligible={["CSE", "ECE"]}
          courseEligible={["B.Tech", "M.Tech"]}
          minCGPA={8.0}
          minClass10={85}
          minClass12={90}
          deadline="2025-07-01"
          opportunityType="Internship"
          bond="No Bond"
          stipend="80000"
          package="45"
          jobId="google-sde-2025"
          jobDescriptionLink="https://drive.google.com/example"
          remarks="Only for final year students"
        />{" "}
        <JobBarTile
          companyName="Google"
          jobTitle="SDE Intern"
          jobType="IT"
          branchEligible={["CSE", "ECE"]}
          courseEligible={["B.Tech", "M.Tech"]}
          minCGPA={8.0}
          minClass10={85}
          minClass12={90}
          deadline="2025-07-01"
          opportunityType="Internship"
          bond="No Bond"
          stipend="80000"
          package="45"
          jobId="google-sde-2025"
          jobDescriptionLink="https://drive.google.com/example"
          remarks="Only for final year students"
        />{" "}
        <JobBarTile
          companyName="Google"
          jobTitle="SDE Intern"
          jobType="IT"
          branchEligible={["CSE", "ECE"]}
          courseEligible={["B.Tech", "M.Tech"]}
          minCGPA={8.0}
          minClass10={85}
          minClass12={90}
          deadline="2025-07-01"
          opportunityType="Internship"
          bond="No Bond"
          stipend="80000"
          package="45"
          jobId="google-sde-2025"
          jobDescriptionLink="https://drive.google.com/example"
          remarks="Only for final year students"
        />{" "}
        <JobBarTile
          companyName="Google"
          jobTitle="SDE Intern"
          jobType="IT"
          branchEligible={["CSE", "ECE"]}
          courseEligible={["B.Tech", "M.Tech"]}
          minCGPA={8.0}
          minClass10={85}
          minClass12={90}
          deadline="2025-07-01"
          opportunityType="Internship"
          bond="No Bond"
          stipend="80000"
          package="45"
          jobId="google-sde-2025"
          jobDescriptionLink="https://drive.google.com/example"
          remarks="Only for final year students"
        />
      </Box>
    </Container>
  );
}
