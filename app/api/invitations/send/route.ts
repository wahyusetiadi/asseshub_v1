import { NextResponse } from "next/server";
import { SendInvitationRequest, Invitation } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body: SendInvitationRequest = await request.json();
    const { candidateIds, testId, scheduleDate, scheduleTime } = body;

    if (!candidateIds || candidateIds.length === 0 || !testId) {
      return NextResponse.json(
        {
          success: false,
          message: "Kandidat dan test wajib dipilih",
        },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const sentInvitations: Invitation[] = candidateIds.map((id) => ({
      candidateId: id,
      testId,
      sentAt: new Date().toISOString(),
      scheduledFor: scheduleDate && scheduleTime 
        ? `${scheduleDate}T${scheduleTime}:00Z` 
        : null,
      status: "sent" as const,
    }));

    return NextResponse.json({
      success: true,
      data: sentInvitations,
      message: `Berhasil mengirim undangan ke ${candidateIds.length} kandidat`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengirim undangan",
      },
      { status: 500 }
    );
  }
}
