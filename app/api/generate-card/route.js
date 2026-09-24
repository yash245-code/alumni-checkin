import { findAlumniMatch } from '@/lib/alumni-lookup';
import { generateAlumniCard } from '@/lib/generate-card';

// POST: Re-verifies the alumnus (same 3-field check as /api/lookup) and, only on a
// genuine match, generates a one-off welcome-card PDF with their name, department,
// and a randomly chosen quote. Re-verifying here (rather than trusting whatever the
// client sends) means a card can't be generated for someone who never checked in.
export async function POST(request) {
  try {
    let body;
    try {
      const rawText = await request.text();
      try {
        body = JSON.parse(rawText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          body = JSON.parse(jsonMatch[0]);
        } else {
          return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
        }
      }
    } catch {
      return Response.json({ error: 'Malformed request body.' }, { status: 400 });
    }

    const identifier = body?.identifier || body?.email || body?.phone || '';

    if (!body?.name || !identifier || !body?.department) {
      return Response.json({ error: 'Missing name, identifier, or department.' }, { status: 400 });
    }

    const matched = findAlumniMatch({ name: body.name, identifier, department: body.department });

    if (!matched) {
      return Response.json({ error: 'Could not verify these details.' }, { status: 403 });
    }

    const pdfBytes = await generateAlumniCard({
      name: matched.name,
      department: matched.department,
    });

    const safeFileName = matched.name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFileName || 'welcome'}-card.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Card generation error:', err);
    return Response.json({ error: 'Failed to generate card.' }, { status: 500 });
  }
}
