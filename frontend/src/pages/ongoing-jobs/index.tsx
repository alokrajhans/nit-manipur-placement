import { useEffect, useState } from "react";
import AddJobDialog from "@/src/components/add-job";
import JobBarTile from "@/src/components/jobTitle";
import { Container, Box, Typography } from "@mui/material";
import { OngoingJob, getOngoingJobs } from "@/src/service/ongoingJobs";
import { useRouter } from "next/router";
import { useAppSelector } from "@/src/components/hooks";
import { media } from "@/src/utils/breakpoints";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PullToRefreshBanner from "@/src/components/PullToRefreshBanner";

// Helper mappings
function mapJobType(type?: string): "IT" | "Core" {
  return type === "IT" || type === "Core" ? type : "IT";
}

function mapOpportunityType(opp?: string): "Internship" | "PPO" | "Full time" {
  return opp === "Internship" || opp === "PPO" || opp === "Full time" ? opp : "Full time";
}

function mapBond(bond?: string): "Bond" | "No Bond" {
  return bond === "Bond" || bond === "No Bond" ? bond : "No Bond";
}
function mapBacklog(backlog?: string): "No Active Backlog" | "No History Backlog" | "No Critera for Backlog" {
  const allowedBacklogs = ["No Active Backlog", "No History Backlog", "No Critera for Backlog"] as const;

  if (allowedBacklogs.includes(backlog as any)) {
    return backlog as typeof allowedBacklogs[number];
  }

  return "No Critera for Backlog"; // default fallback
}



export default function OngoingJobsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:460px)");
  const [jobs, setJobs] = useState<OngoingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [roleD, setRoleD] = useState<number | null>(null);

  const router = useRouter();
  const { role, enrollment_number } = useAppSelector((state) => state.user);

  


useEffect(() => {
  if (!isMobile) return;

  const handleScroll = () => {
    if (window.scrollY === 0) {
      // User is at top of page
      console.log("At top - refreshing");
      window.location.reload(); // Or call fetchJobs()
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [isMobile]);


  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
    const localRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (localRole) {
      setRoleD(Number(localRole));
    }

    setCheckingAuth(false);

    async function fetchJobs() {
      try {
        setLoading(true);
        const jobsList = await getOngoingJobs();

        // Sort by date_updated (most recent first)
        const sortedJobs = jobsList.sort((a, b) => {
          const dateA = new Date(a.date_updated ?? "").getTime();
          const dateB = new Date(b.date_updated ?? "").getTime();
          return dateB - dateA;
        });

        setJobs(sortedJobs);
      } catch (err) {
        setError("Failed to load jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [router, role, enrollment_number]);

  // if (checkingAuth) {
  //   return <Typography>Checking authentication...</Typography>;
  // }

  const showAddJob = role !== 2 && (roleD === 0 || roleD === 1);

  

  return (
    <Container >
      {showAddJob && (
        <Box mt={2}>
          <AddJobDialog />
        </Box>
      )}

      <Box mt={3} sx={{ [media.st]: { minWidth: "100px" } }}>
        {loading && <Typography>Loading jobs...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && jobs.length === 0 && (
          <Typography>No jobs available.</Typography>
        )}

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
              backlog={mapBacklog(job.backlog)}
              stipend={job.stipend?.toString() ?? "0"}
              package={job.package?.toString() ?? "0"}
              jobId={job.id?.toString() ?? ""}
              jobDescriptionLink={job.jobDescriptionLink ?? ""}
              remarks={job.remarks ?? ""}
              handleBy={job.handleBy ?? ""}
              isApplied={job.isApplied}
            />
          ))}
      </Box>
    </Container>
  );
}
