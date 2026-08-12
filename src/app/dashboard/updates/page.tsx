import DashboardShell from "../DashboardShell";

import {
  getFounderDashboardData,
} from "../getFounderDashboardData";

import UpdatesClient from "./UpdatesClient";

export default async function UpdatesPage() {
  const founder =
    await getFounderDashboardData();

  return (
    <DashboardShell
      firstName={
        founder.firstName
      }
      lastName={
        founder.lastName
      }
      founderNumber={
        founder.founderNumber
      }
      email={founder.email}
      memberType={
        founder.memberType
      }
      countryOfResidence={
        founder.countryOfResidence
      }
      countryOfOrigin={
        founder.countryOfOrigin
      }
      cityOfResidence={
        founder.cityOfResidence
      }
      username={
        founder.username
      }
      activeSection="updates"
      unreadUpdates={3}
    >
      <UpdatesClient />
    </DashboardShell>
  );
}