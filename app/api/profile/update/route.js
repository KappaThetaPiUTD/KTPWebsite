import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

export async function POST(request) {
  try {
    const body = await request.json();
  const { id, name, graduation_date, phone } = body;
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    // --- Validation helpers ---
    const validateName = (n) => {
      if (n === undefined || n === null) return true; // not provided -> ok
      if (typeof n !== 'string') return false;
      
      const trimmed = n.trim();
      if (trimmed.length === 0) return false;
      if (trimmed.length > 100) return false;
      
      // Check for valid name format:
      // - Only letters, spaces, hyphens, and apostrophes allowed
      // - Must start and end with a letter
      // - No consecutive special characters
      // - At least two characters long
      const nameRegex = /^[A-Za-z]+(?:['\s\-][A-Za-z]+)*$/;
      if (!nameRegex.test(trimmed)) return false;
      
      // Check for minimum length (at least 2 characters, excluding spaces and special chars)
      const lettersOnly = trimmed.replace(/[^A-Za-z]/g, '');
      if (lettersOnly.length < 2) return false;
      
      // Split into words and check each word is reasonable
      const words = trimmed.split(/\s+/);
      for (const word of words) {
        // Each word should be at least 2 characters (excluding special chars)
        const wordLetters = word.replace(/[^A-Za-z]/g, '');
        if (wordLetters.length < 2) return false;
        
        // Check for reasonable case (not all uppercase or lowercase)
        if (word === word.toUpperCase() || word === word.toLowerCase()) {
          return false;
        }
      }
      
      return true;
    };

    const validateGraduationYear = (y) => {
      if (y === undefined || y === null) return true; // not provided -> ok
      const num = Number(y);
      if (!Number.isInteger(num)) return false;
      // sensible range for graduation year
      if (num < 1900 || num > 2100) return false;
      return true;
    };

    const sanitizePhone = (p) => {
      if (p === undefined || p === null) return null;
      if (typeof p !== 'string') return null;
      const trimmed = p.trim();
      if (trimmed.length === 0) return null;
      // Remove all non-digit characters
      const digits = trimmed.replace(/\D/g, '');
      // Must be exactly 10 digits for US phone numbers
      if (digits.length !== 10) return null;
      // Format as (XXX) XXX-XXXX
      return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    };

    // Collect all validation errors
    const errors = {};
    
    if (!validateName(name)) {
      errors.name = 'Please enter a valid name using proper capitalization (e.g., "John Smith" or "Mary Jane-Smith"). Names should only contain letters, hyphens, apostrophes, and spaces.';
    }
    
    if (!validateGraduationYear(graduation_date)) {
      errors.graduation_date = 'Invalid graduation year';
    }
    
    const cleanedPhone = phone !== undefined ? sanitizePhone(phone) : undefined;
    if (phone !== undefined && cleanedPhone === null) {
      errors.phone = 'Invalid phone number - must be 10 digits';
    }

    // If there are any validation errors, return them all
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Build update payload with only allowed fields
    const upd = {};
    if (name !== undefined) upd.name = name.trim();
    if (graduation_date !== undefined) upd.graduation_date = Number(graduation_date);
    if (phone !== undefined) upd.phone = cleanedPhone;

    const { data, error } = await supabaseServer
      .from('users')
      .update(upd)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Server update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected server error updating profile:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
