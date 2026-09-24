import { findAlumniMatch, getAlumniData } from '@/lib/alumni-lookup';

// POST: Strict multi-field verification (Name, Email/Phone, and Department must all match)
export async function POST(request) {
  try {
    const body = await request.json();
    const identifier = body?.identifier || body?.email || body?.phone || '';

    if (!body?.name || !identifier || !body?.department) {
      return Response.json(
        {
          found: false,
          message: 'All fields (Name, Registered Email/Phone, and Department) are required.',
        },
        { status: 400 }
      );
    }

    const matched = findAlumniMatch({ name: body.name, identifier, department: body.department });

    if (!matched) {
      return Response.json({
        found: false,
        message: 'Details could not be verified. Please ensure your Name, Email/Phone, and Department match the registered records exactly.',
      });
    }

    return Response.json({
      found: true,
      name: matched.name,
      department: matched.department,
    });
  } catch (err) {
    console.error('API lookup error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Sanity check / health endpoint
export async function GET() {
  const alumni = getAlumniData();
  return Response.json({
    status: 'ok',
    loaded: alumni.length,
  });
}
