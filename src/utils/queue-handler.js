export function handlers(type, payload) {
  switch (type) {
    case "user.created": {
      console.log("📩 Criar usuário com payload:", payload);
    }
    case "user.updated": {
      console.log("✏️ Atualizar usuário com payload:", payload);
    }
    case "user.deleted": {
      console.log("🗑️ Excluir usuário com id:", payload.id);
    }
    default: {
      console.warn(`⚠️ Handler não encontrado para tipo: ${type}`);
    }
  }
}