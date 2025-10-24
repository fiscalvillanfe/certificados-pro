export const runtime = 'nodejs';
// src/app/api/pedidos/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import type { Responsavel, TokenOpcao } from '@prisma/client';

function normalizeResponsavel(input: any): Responsavel {
  if (input === 'FRANK GIOVANNI LOPES') return 'FRANK_GIOVANNI_LOPES';
  if (input === 'MATHEUS CARDOSO SOARES') return 'MATHEUS_CARDOSO_SOARES';
  if (input === 'FRANK_GIOVANNI_LOPES' || input === 'MATHEUS_CARDOSO_SOARES') return input;
  return 'FRANK_GIOVANNI_LOPES';
}
function normalizeToken(input: any): TokenOpcao | null {
  if (input == null || input === '') return null;
  if (input === 'com-token' || input === 'COM_TOKEN') return 'COM_TOKEN';
  if (input === 'sem-token' || input === 'SEM_TOKEN') return 'SEM_TOKEN';
  return null;
}
function unmapToken(t: TokenOpcao | null) {
  if (!t) return null;
  return t === 'COM_TOKEN' ? 'com-token' : 'sem-token';
}
function unmapResponsavel(r: Responsavel) {
  return r === 'FRANK_GIOVANNI_LOPES' ? 'FRANK GIOVANNI LOPES' : 'MATHEUS CARDOSO SOARES';
}

type RouteParams = { params: { id: string } };

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const body = await req.json();

    const updated = await prisma.pedido.update({
      where: { id: params.id },
      data: {
        tipo: String(body.tipo),
        isA3: !!body.isA3,
        isCnpj: !!body.isCnpj,
        cpfCnpj: String(body.cpfCnpj),
        nomePessoa: body.nomePessoa ?? null,
        curador: body.curador ?? null,
        nomeEmpresa: body.nomeEmpresa ?? null,
        representanteLegal: body.representanteLegal ?? null,
        tokenOpcao: normalizeToken(body.tokenOpcao),
        valorTotal: Number(body.valorTotal ?? 0),
        valorRecebido: Number(body.valorRecebido ?? 0),
        responsavel: normalizeResponsavel(body.responsavel),
      },
    });

    return NextResponse.json({
      ...updated,
      valorTotal: Number(updated.valorTotal),
      valorRecebido: Number(updated.valorRecebido),
      tokenOpcao: unmapToken(updated.tokenOpcao),
      responsavel: unmapResponsavel(updated.responsavel),
    });
  } catch (e: any) {
    console.error('PUT /api/pedidos/[id] error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    await prisma.pedido.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('DELETE /api/pedidos/[id] error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
