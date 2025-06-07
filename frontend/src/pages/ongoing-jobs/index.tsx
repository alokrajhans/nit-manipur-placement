import { useEffect, useState } from "react";
import AddJobDialog from "@/src/components/add-job";
import JobBarTile from "@/src/components/jobTitle";
import Navbar from "@/src/components/Navbar";
import { Container, Box } from "@mui/material";
import { OngoingJob, getOngoingJobs } from "@/src/service/ongoingJobs";
import { useRouter } from "next/router";
import { useAppSelector } from "@/src/components/hooks";

// Helper functions
function mapJobType(type?: string): "IT" | "Core" {
  return type === "IT" || type === "Core" ? type : "IT";
}

function mapOpportunityType(opp?: string): "Internship" | "PPO" | "Full time" {
  return opp === "Internship" || opp === "PPO" || opp === "Full time" ? opp : "Full time";
}

function mapBond(bond?: string): "Bond" | "No Bond" {
  return bond === "Bond" || bond === "No Bond" ? bond : "No Bond";
}

export default function HomePage() {
  const [jobs, setJobs] = useState<OngoingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [roleD, setRoleD] = useState<number | null>(null);

  const router = useRouter();
  const { role, enrollment_number } = useAppSelector((state) => state.user);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
    const localRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    // Redirect to login if token or user info missing
    // if (!token || role === null || enrollment_number === null) {
    //   router.replace("/login");
    //   return;
    // }

    if (localRole) {
      setRoleD(Number(localRole));
    }

    setCheckingAuth(false);

    async function fetchJobs() {
      try {
        setLoading(true);
        const jobsList = await getOngoingJobs();
        setJobs(jobsList);
      } catch (err) {
        setError("Failed to load jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [router, role, enrollment_number]);

  if (checkingAuth) {
    return <p>Checking authentication...</p>;
  }

  const showAddJob = role !== 2  && (roleD === 0 || roleD === 1);

  return (
    <Container>
      <Box>
        <Navbar />
      </Box>

      {showAddJob && (
        <Box mt="10px">
          <AddJobDialog />
        </Box>
      )}

      <Box sx={{ mt: "10px" }}>
        {loading && <p>Loading jobs...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && jobs.length === 0 && <p>No jobs available.</p>}

        {!loading &&
          !error &&
          jobs.map((job) => (
            <JobBarTile
              key={job.id}
              companyName={job.company_name ?? ""}
              jobTitle={job.job_title ?? ""}
              jobType={mapJobType(job.type)}
              branchEligible={
                job.Branch
                  ? (job.Branch.split(",").map((b) => b.trim()) as (
                      | "CSE"
                      | "ECE"
                      | "EE"
                      | "ME"
                      | "CE"
                    )[])
                  : []
              }
              courseEligible={
                job.Course
                  ? (job.Course.split(",").map((c) => c.trim()) as (
                      | "B.Tech"
                      | "M.Tech"
                      | "M.Sc"
                    )[])
                  : []
              }
              minCGPA={job.min_cgpa ?? 0}
              minClass10={job.class_10th_percentage ?? 0}
              minClass12={job.class_12th_percentage ?? 0}
              deadline={job.deadline ?? ""}
              opportunityType={mapOpportunityType(job.opportunity)}
              bond={mapBond(job.bond)}
              stipend={job.stipend?.toString() ?? "0"}
              package={job.package?.toString() ?? "0"}
              jobId={job.id?.toString() ?? ""}
              jobDescriptionLink={job.jobDescriptionLink ?? ""}
              remarks={job.remarks ?? ""}
            />
          ))}
      </Box>
    </Container>
  );
}
