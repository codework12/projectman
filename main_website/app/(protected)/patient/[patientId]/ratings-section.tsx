"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { PatientRatingContainer } from "../../../../components/patient-rating-container";

interface RatingsSectionProps {
  patientId: string;
}

export default function RatingsSection({ patientId }: RatingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        <PatientRatingContainer id={patientId} />
      </CardContent>
    </Card>
  );
} 