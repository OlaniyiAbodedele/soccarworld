import "server-only";

import { createClient as createAdminClient } from "@supabase/supabase-js";

export type AdminFoundingMember = {
  memberId: string;
  founderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  countryOfResidence: string | null;
  countryOfOrigin: string | null;
  cityOfResidence: string | null;
  memberType: string;
  accountStatus: string;
  issuedAt: string;
  activatedAt: string | null;
};

type FounderMembershipRelation = {
  founder_number: number;
  issued_at: string;
  activated_at: string | null;
  status: string;
};

function formatFounderNumber(
  value: number
) {
  return String(value).padStart(
    5,
    "0"
  );
}

export async function getFoundingMembersData(): Promise<
  AdminFoundingMember[]
> {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    throw new Error(
      "Missing required Supabase server environment variables."
    );
  }

  const supabaseAdmin =
    createAdminClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("soccar_members")
    .select(
      `
        id,
        first_name,
        last_name,
        email,
        country_of_residence,
        country_of_origin,
        city_of_residence,
        member_type,
        account_status,
        founder_membership_id,
        founder_memberships (
          founder_number,
          issued_at,
          activated_at,
          status
        )
      `
    )
    .not(
      "founder_membership_id",
      "is",
      null
    )
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "SoccaR Admin Founding Members query error:",
      error
    );

    throw new Error(
      "Could not retrieve Founding Members."
    );
  }

  return (data ?? [])
    .map((member) => {
      /*
       * Supabase may infer a nested
       * relationship as an array.
       * This Founder relationship is
       * one-to-one in our database,
       * so safely normalize it here.
       */
      const relation =
        member
          .founder_memberships;

      const founderMembership:
        | FounderMembershipRelation
        | null =
        Array.isArray(
          relation
        )
          ? ((relation[0] ??
              null) as
              | FounderMembershipRelation
              | null)
          : ((relation ??
              null) as
              | FounderMembershipRelation
              | null);

      if (
        !founderMembership ||
        founderMembership.status !==
          "ACTIVE"
      ) {
        return null;
      }

      return {
        memberId:
          member.id,

        founderNumber:
          formatFounderNumber(
            Number(
              founderMembership
                .founder_number
            )
          ),

        firstName:
          member.first_name,

        lastName:
          member.last_name,

        email:
          member.email,

        countryOfResidence:
          member
            .country_of_residence,

        countryOfOrigin:
          member
            .country_of_origin,

        cityOfResidence:
          member
            .city_of_residence,

        memberType:
          member.member_type,

        accountStatus:
          member
            .account_status,

        issuedAt:
          founderMembership
            .issued_at,

        activatedAt:
          founderMembership
            .activated_at,
      };
    })
    .filter(
      (
        member
      ): member is AdminFoundingMember =>
        member !== null
    );
}