@echo off
echo.
echo ========================================
echo    🧸 REINO DOS BRINQUEDOS 🧸
echo ========================================
echo.
echo 🚀 Iniciando aplicacao...
echo.

echo 📋 Verificando servicos...

REM Verificar se o backend está rodando
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend nao esta rodando!
    echo 💡 Execute: cd backend && npm run dev
    echo.
    goto :frontend_check
) else (
    echo ✅ Backend rodando na porta 3001
)

:frontend_check
REM Verificar se o frontend está rodando
curl -s http://localhost:5180 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Frontend nao esta rodando!
    echo 💡 Execute: cd frontend && npm run dev
    echo.
    goto :instructions
) else (
    echo ✅ Frontend rodando na porta 5180
)

echo.
echo 🎉 Todos os servicos estao rodando!
echo.

:instructions
echo ========================================
echo           📱 COMO ACESSAR
echo ========================================
echo.
echo 🌐 URL: http://localhost:5180
echo 📧 Email: admin@loja.com
echo 🔑 Senha: admin123
echo.
echo ========================================
echo          🧭 NAVEGACAO RAPIDA
echo ========================================
echo.
echo 🏠 Dashboard - Visao geral
echo 👨‍👩‍👧‍👦 Familias e Criancas - Gestao de clientes
echo 💰 Vendas e Pedidos - Controle de vendas
echo ⚙️ Configuracoes - Preferencias
echo.
echo ========================================
echo           🔧 TESTES RAPIDOS
echo ========================================
echo.
echo 1. Acesse: http://localhost:5180
echo 2. Faca login com as credenciais acima
echo 3. Va para "Familias e Criancas"
echo 4. Clique em "🔧 Testar Sistema"
echo 5. Teste adicionar um novo cliente
echo.

REM Abrir automaticamente no navegador
echo 🌐 Abrindo aplicacao no navegador...
start http://localhost:5180

echo.
echo 🎯 Aplicacao aberta! Divirta-se! 🧸✨
echo.
pause
