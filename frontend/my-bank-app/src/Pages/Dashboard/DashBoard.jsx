import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import style from './Dashboard.module.css';
import Footer from '../../Components/Footer/Footer';
const DashBoard = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";

  const isSystemAdmin = localStorage.getItem("isSystemUser") === "true" || account?.user?.systemUser === true;
  console.log("isSystemAdmin:", isSystemAdmin);
  useEffect(() => {
    // Agar token nahi hai toh login pe wapis
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // 1. Account Details Check
        const accRes = await fetch("http://localhost:3000/api/accounts/detail", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const accData = await accRes.json();

        // Note: Backend se 'accounts' array aa raha hai
        if (accRes.ok && accData.accounts?.length > 0) {
          const currentAcc = accData.accounts[0];
          setAccount(currentAcc);
          const accId = currentAcc._id;

          // 2. Parallel Fetch: Balance aur Ledger
          const [balRes, ledRes] = await Promise.all([
            fetch(`http://localhost:3000/api/accounts/balance/${accId}`, {
              headers: { "Authorization": `Bearer ${token}` }
            }),
            fetch(`http://localhost:3000/api/accounts/ledger/${accId}`, {
              headers: { "Authorization": `Bearer ${token}` }
            })
          ]);

          const balData = await balRes.json();
          const ledData = await ledRes.json();

          if (balRes.ok) setBalance(balData.balance);
          if (ledRes.ok) setLedger(ledData.ledger || []);

        } else {
          // Agar account list empty hai aur system admin nahi hai
          if (!isSystemAdmin) {
            navigate("/create-account");
          }

        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, navigate, isSystemAdmin]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className={style.loader}>Updating Balance...</div>;
  console.log("System User check:", account?.user);
  return (
    <>
      <div className={style.dashboardWrapper}>
        {/* Sidebar Section */}
        <aside className={style.sidebar}>
          <div className={style.sidebarLogo}>
            <h2>Uk Bank</h2>
          </div>
          <ul className={style.sidebarMenu}>
            <li className={style.active}><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/transaction">Transfer</Link></li>
          </ul>
          <div className={style.sidebarFooter}>
            <button className={style.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </aside>

        {/* Main Area */}
        <main className={style.mainArea}>
          <header className={style.welcomeHeader}>
            <div>
              <h1>Hi, {userName}!</h1>
              <p><strong>{account?.accountTitle || "System Admin"}</strong>'Account</p>
            </div>
            <div className={style.statusBadge}>{account?.status || "Active"}</div>
          </header>
          {account && (
            <section className={style.balanceSection}>
              <div className={style.balanceCard}>
                <p className={style.cardLabel}>CURRENT BALANCE</p>
                <h1 className={style.amount}>
                  {account?.currency || "PKR"} {balance.toLocaleString()}
                </h1>
                <div className={style.cardActions}>
                  {!isSystemAdmin && (
                    <button className={style.sendBtn} onClick={() => navigate("/transactions")}>
                      Send Money
                    </button>
                  )}

                </div>
              </div>
            </section>
          )}


          {isSystemAdmin && (
            <section className={style.systemPanel}>
              <div className={style.adminCard}>
                <h3>Admin Controls</h3>
                <p>You have system-level access to deposit cash.</p>
                <button className={style.depositBtn} onClick={() => navigate("/system")}>
                  + Add Cash to Customer Account
                </button>
              </div>
            </section>
          )}


          {account && (
            <section className={style.ledgerSection}>
              <div className={style.ledgerHeader}>
                <h3>Transaction Ledger</h3>
              </div>
              <div className={style.ledgerList}>
                {ledger.length > 0 ? (
                  ledger.map((tx) => (
                    <div key={tx._id} className={style.ledgerItem}>
                      <div className={style.txLeft}>
                        <div className={tx.type === "CREDIT" ? style.iconCredit : style.iconDebit}>
                          {tx.type === "CREDIT" ? "↓" : "↑"}
                        </div>
                        <div>
                          <p className={style.txType}>{tx.type === "CREDIT" ? "Money Received" : "Money Sent"}</p>
                          <small className={style.txId}>TXID: {tx.transaction?.substring(0, 10)}</small>
                        </div>
                      </div>
                      <div className={tx.type === "CREDIT" ? style.creditAmount : style.debitAmount}>
                        {tx.type === "CREDIT" ? "+" : "-"} {tx.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={style.noData}>No transaction history found.</div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default DashBoard;