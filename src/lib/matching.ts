import { AlumniProfileData, MatchExplanation, StudentProfileData } from '../types';

/**
 * Deterministic Explainable Rule-Based Matching Algorithm
 * 
 * Scoring Weights (Total 100 points):
 * 1. Skills Overlap (40%): Overlap between student's target skills/current skills and alumni expertise.
 * 2. Career Goal & Target Role Alignment (30%): Overlap between student's desired target roles and alumni current/past titles.
 * 3. Industry Relevance (20%): Match between student's target industries and alumni industry sector.
 * 4. Mentor Availability & Capacity (10%): Mentor actively accepting requests and having open slots.
 */
export function calculateMatch(
  student?: StudentProfileData,
  alumni?: AlumniProfileData
): MatchExplanation {
  if (!student || !alumni) {
    return {
      overallScore: 65,
      breakdown: {
        skillsScore: 25,
        roleScore: 20,
        industryScore: 12,
        availabilityScore: 8,
      },
      reasons: ['Baseline university alumni network affinity.'],
      overlappingSkills: [],
      skillGaps: [],
      roleAlignment: 'General Career Guidance',
    };
  }

  const reasons: string[] = [];

  // --- 1. Skills Overlap (Max 40 points) ---
  const allStudentSkills = Array.from(
    new Set([
      ...(student.skillsToLearn || []),
      ...(student.currentSkills || []),
    ].map((s) => s.toLowerCase().trim()))
  );

  const alumniSkills = (alumni.expertiseSkills || []).map((s) =>
    s.toLowerCase().trim()
  );

  const overlappingSkillsRaw = (alumni.expertiseSkills || []).filter((s) =>
    allStudentSkills.includes(s.toLowerCase().trim())
  );

  // Skill gaps: skills the alumni possesses that student has not yet mastered
  const studentMastered = (student.currentSkills || []).map((s) =>
    s.toLowerCase().trim()
  );
  const skillGaps = (alumni.expertiseSkills || []).filter(
    (s) => !studentMastered.includes(s.toLowerCase().trim())
  );

  let skillsScore = 0;
  if (allStudentSkills.length > 0 && alumniSkills.length > 0) {
    const overlapRatio = overlappingSkillsRaw.length / Math.min(allStudentSkills.length, 5);
    skillsScore = Math.min(40, Math.round(overlapRatio * 35) + (overlappingSkillsRaw.length > 0 ? 5 : 0));
  } else {
    skillsScore = 20; // default moderate score
  }

  if (overlappingSkillsRaw.length > 0) {
    reasons.push(
      `Direct skill match on ${overlappingSkillsRaw.slice(0, 3).join(', ')}${
        overlappingSkillsRaw.length > 3 ? ` (+${overlappingSkillsRaw.length - 3} more)` : ''
      }.`
    );
  }

  // --- 2. Role & Goal Alignment (Max 30 points) ---
  let roleScore = 10;
  let roleAlignment = 'Related Tech/Design Track';
  const alumniTitleLower = alumni.currentTitle.toLowerCase();
  const pastTitles = (alumni.pastCompanies || []).map((p) => p.toLowerCase());

  const matchedTargetRole = (student.targetRoles || []).find((role) => {
    const roleLower = role.toLowerCase();
    return (
      alumniTitleLower.includes(roleLower) ||
      roleLower.includes(alumniTitleLower) ||
      pastTitles.some((p) => p.includes(roleLower))
    );
  });

  if (matchedTargetRole) {
    roleScore = 30;
    roleAlignment = `Direct role trajectory: ${matchedTargetRole}`;
    reasons.push(`Alumnus holds or held your target role: "${alumni.currentTitle}".`);
  } else {
    // Check partial semantic keyword overlap
    const studentRoleKeywords = (student.targetRoles || [])
      .join(' ')
      .toLowerCase()
      .split(/\s+/);
    const hasPartial = studentRoleKeywords.some(
      (kw) => kw.length > 3 && alumniTitleLower.includes(kw)
    );
    if (hasPartial) {
      roleScore = 22;
      roleAlignment = 'Complementary functional discipline';
      reasons.push(`Strong overlap in functional domain (${alumni.currentTitle}).`);
    } else {
      roleScore = 15;
      roleAlignment = 'Cross-functional mentorship';
    }
  }

  // --- 3. Industry Relevance (Max 20 points) ---
  let industryScore = 8;
  const alumniIndustry = (alumni.industry || '').toLowerCase();
  const matchedIndustry = (student.targetIndustries || []).find((ind) => {
    const indLower = ind.toLowerCase();
    return (
      alumniIndustry.includes(indLower) ||
      indLower.includes(alumniIndustry)
    );
  });

  if (matchedIndustry) {
    industryScore = 20;
    reasons.push(`Target industry match in ${alumni.industry} (${alumni.company}).`);
  } else if (student.targetIndustries && student.targetIndustries.length > 0) {
    industryScore = 12;
    reasons.push(`Transferable industry experience in ${alumni.industry}.`);
  } else {
    industryScore = 14;
  }

  // --- 4. Availability & Capacity (Max 10 points) ---
  let availabilityScore = 0;
  if (alumni.isAcceptingRequests) {
    availabilityScore += 5;
    if (alumni.availableSlots && alumni.availableSlots.length > 0) {
      availabilityScore += 5;
      reasons.push(`Active mentor with open weekly 1-on-1 calendar slots.`);
    } else {
      availabilityScore += 3;
      reasons.push(`Accepting asynchronous review requests.`);
    }
  } else {
    availabilityScore = 2;
    reasons.push(`Currently at near capacity; response time may be slower.`);
  }

  const overallScore = Math.min(
    100,
    Math.max(40, skillsScore + roleScore + industryScore + availabilityScore)
  );

  return {
    overallScore,
    breakdown: {
      skillsScore,
      roleScore,
      industryScore,
      availabilityScore,
    },
    reasons,
    overlappingSkills: overlappingSkillsRaw,
    skillGaps: skillGaps.slice(0, 4),
    roleAlignment,
  };
}
