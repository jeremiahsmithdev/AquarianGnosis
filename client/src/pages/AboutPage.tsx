/**
 * AboutPage - Philosophy and mission statement for Aquarian Gnosis
 * Displays the project's philosophical foundations, spiritual principles, and vision
 */
import React from 'react';
import '../styles/about.css';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About</h1>
        <button onClick={() => onNavigate('landing')} className="back-button">
          Back to Home
        </button>
      </div>

      <article className="about-content">
        <header className="about-header">
          <h2>The Philosophy of Aquarian Gnosis</h2>
          <p className="about-subtitle">
            <em>Connecting Gnostic Seekers Worldwide in the Age of Aquarius</em>
          </p>
        </header>

        <blockquote className="featured-quote">
          <p>"All religions are precious pearls strung upon the golden thread of divinity."</p>
          <cite>— Samael Aun Weor</cite>
        </blockquote>

        <p className="wisdom-line"><em>The Tree of Life has many branches.</em></p>

        <section className="about-section">
          <h3>Introduction</h3>
          <p>
            In this era of unprecedented global connection and spiritual seeking, <strong>Aquarian Gnosis</strong> emerges
            as a digital sanctuary—a unified platform dedicated to the universal teachings of gnosis as transmitted
            through Samael Aun Weor and the great masters of wisdom throughout history.
          </p>
          <p>
            This document outlines the philosophical foundations, spiritual principles, and unifying vision that guide
            the Aquarian Gnosis project, serving as both a declaration of purpose and an invitation to seekers everywhere.
          </p>
        </section>

        <section className="about-section">
          <h3>What Is Gnosis?</h3>
          <p>
            The word <em>Gnosis</em> comes from the Greek γνῶσις, meaning "knowledge." But this is not ordinary
            intellectual knowledge—it is <strong>direct experiential knowledge</strong> of divine and spiritual
            realities, acquired through inner work and the awakening of consciousness.
          </p>
          <p>
            As described by gnostic teachers, Gnosis is "a very natural function of the consciousness,
            a <em>perennis et universalis</em> philosophy"—a perennial and universal wisdom that has existed
            throughout all ages and cultures, expressed through various forms but containing one essential truth.
          </p>

          <h4>Two Dimensions of Gnosis</h4>
          <ul>
            <li>
              <strong>Direct Inner Experience:</strong> Knowledge acquired through personal spiritual practice,
              meditation, and the awakening of latent faculties within the human being. This is the foundation
              of all authentic religious experience.
            </li>
            <li>
              <strong>Transmitted Teachings:</strong> Wisdom passed down from realized masters—Jesus, Buddha,
              Krishna, Samael Aun Weor, and others—who have verified these truths through their own inner gnosis
              and share them for the benefit of humanity.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h3>The Aquarian Age</h3>
          <p>
            According to esoteric tradition, humanity progresses through great cosmic cycles called <em>astrological ages</em>,
            each lasting approximately 2,160 years. Samael Aun Weor declared February 4, 1962, to be the beginning of
            the Age of Aquarius, marked by a significant celestial alignment of planets in the constellation Aquarius.
          </p>

          <h4>From Pisces to Aquarius</h4>
          <p>
            The Age of Pisces, associated with the rise of Christianity and institutional religion, was characterized
            by faith, devotion, and the struggle between spiritualism and materialism. In the symbolism of Pisces,
            the fish lives "under the waters" and is "carried by the currents"—representing humanity governed by
            instinct rather than conscious understanding.
          </p>
          <p>
            The Age of Aquarius brings a different energy. In the symbol of Aquarius, a human being holds two urns
            of water, <em>wisely combining the waters at will</em>. This represents humanity learning to consciously
            work with its creative energies and achieving self-mastery through knowledge rather than blind faith.
          </p>

          <h4>Characteristics of the Aquarian Era</h4>
          <ul>
            <li>
              <strong>Universal Access to Knowledge:</strong> Wisdom that was once reserved for initiates in secret
              temples is now available to all sincere seekers. High technology enables widespread dissemination of
              spiritual teachings.
            </li>
            <li>
              <strong>Individual Inner Authority:</strong> Rather than following external religious authorities,
              each person is called to discover their own Inner Being and become their own guide. "We are not
              looking for followers; we only want for each person to follow themselves, their own Inner Master."
            </li>
            <li>
              <strong>Synthesis of All Religions:</strong> The Aquarian age recognizes the essential unity underlying
              all authentic spiritual traditions. All religions point to the same transcendent reality, expressed
              through different symbols and practices.
            </li>
            <li>
              <strong>Revolution of Consciousness:</strong> The emphasis shifts from external ritual to internal
              transformation—the psychological and spiritual work of awakening consciousness and eliminating the
              obstacles to enlightenment.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h3>Samael Aun Weor and the Modern Gnostic Movement</h3>
          <p>
            Samael Aun Weor (1917–1977) was a Colombian-born spiritual teacher who founded the modern Gnostic Movement
            and authored over sixty books on esoteric spirituality. His name, Kabbalistic in nature, means "Word of Light"
            (<em>Aun Weor</em>), and he is regarded by his students as the Avatar, or messenger, of the Aquarian Age.
          </p>

          <h4>The Synthesis of Ancient Wisdom</h4>
          <p>
            Drawing from Kabbalah, Alchemy, Yoga, Theosophy, Buddhism, Christianity, and indigenous wisdom traditions,
            Samael Aun Weor presented a practical synthesis demonstrating the unity of all authentic spiritual knowledge.
            His approach was distinctly experiential: every teaching was meant to be verified through direct practice,
            not accepted on blind faith.
          </p>

          <blockquote>
            <p>
              "We do not want more comedies or farces or false mysticism and false schools. Now we want living realities,
              to prepare ourselves in order to see, hear and touch the reality of those truths."
            </p>
          </blockquote>

          <h4>The Lineage of Masters</h4>
          <p>Aquarian Gnosis honors the great masters throughout history who have brought light to humanity:</p>
          <ul>
            <li>
              <strong>Jesus Christ</strong> — The Cosmic Christ, whose teachings of death and resurrection symbolize
              the psychological transformation of the human being
            </li>
            <li>
              <strong>Gautama Buddha</strong> — Who taught the Middle Way and the cessation of suffering through
              the elimination of craving and ego
            </li>
            <li>
              <strong>Lord Krishna</strong> — Avatar of Vishnu, who delivered the sacred teachings of the Bhagavad Gita
              on duty, devotion, and self-realization
            </li>
            <li>
              <strong>Samael Aun Weor</strong> — Who synthesized these teachings for the modern era and opened the
              path of initiation to all humanity
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h3>The Three Factors of the Revolution of Consciousness</h3>
          <p>
            At the heart of Gnostic practice are the <strong>Three Factors</strong> for the revolution of consciousness—a
            practical path of transformation that integrates the teachings of all authentic spiritual traditions:
          </p>

          <blockquote>
            <p>"If anyone would come after me, let him deny himself, take up his cross, and follow me."</p>
            <cite>— Matthew 16:24</cite>
          </blockquote>

          <h4>1. Death — Psychological Transformation</h4>
          <p>
            The first factor is the <em>mystical death</em>—the dissolution of the ego, or what Gnostic psychology
            calls our "psychological defects." These include anger, pride, lust, envy, greed, and all the manifestations
            of selfishness that keep us separated from our true divine nature.
          </p>
          <p>
            This corresponds to Jesus's teaching to "deny yourself," Buddha's teaching on the cessation of craving,
            and the alchemical process of purification. Through self-observation, comprehension, and the invocation
            of divine help, these psychological aggregates can be eliminated, allowing the pure essence of consciousness
            to shine forth.
          </p>

          <h4>2. Birth — Spiritual Creation</h4>
          <p>
            The second factor is the <em>spiritual birth</em>—the creation of the Soul through the proper use of
            creative energy. This is the "second birth" spoken of by Jesus to Nicodemus: "Unless one is born of
            water and Spirit, he cannot enter the kingdom of God."
          </p>
          <p>
            Through sacred practices of energy transmutation and regeneration, the spiritual aspirant builds what
            esoteric traditions call the "solar bodies" or "vehicles of the soul"—the means by which consciousness
            can navigate the higher dimensions of existence and ultimately achieve union with the Divine.
          </p>

          <h4>3. Sacrifice — Service to Humanity</h4>
          <p>
            The third factor is <em>sacrifice for humanity</em>—the selfless work of helping others to awaken.
            This corresponds to Jesus's teaching to "follow me," the Bodhisattva vow in Buddhism, and the principle
            of <em>karma yoga</em> or selfless action.
          </p>
          <p>
            By sharing the teachings, practicing charity, and working for the benefit of suffering humanity without
            expectation of reward, the spiritual practitioner overcomes the law of entropy and accumulates the
            spiritual merit necessary for inner advancement. "Those who are controlled by the lower self must serve it;
            those who control the lower self serve others."
          </p>
        </section>

        <section className="about-section">
          <h3>The Philosophy of Unity</h3>
          <p>
            Central to the Aquarian Gnosis project is the recognition that the gnostic community today exists in a
            state of fragmentation. Multiple organizations, each with their own approaches and emphases, serve students
            around the world—but there has been no unified platform for seekers across organizational boundaries to
            connect, share resources, and support one another in their spiritual work.
          </p>

          <h4>Beyond Organizational Boundaries</h4>
          <p>
            Aquarian Gnosis embraces practitioners from all gnostic organizations—Glorian Publishing, Koradi Institute,
            AGEAC, the Chicago Gnostic Center, and countless independent study groups around the world. The platform
            takes no sides in organizational politics; instead, it focuses on what unites us: the sincere pursuit of
            self-knowledge and the awakening of consciousness.
          </p>

          <blockquote>
            <p>
              "This teaching is for the rebels of all schools, for those that are not compliant with masters,
              for the non-conformist of all belief systems, for those who still have some courage and a spark
              of love left in their hearts."
            </p>
          </blockquote>

          <h4>One Gnostic Family</h4>
          <p>
            But the family extends far beyond those who identify with gnostic organizations—or even those who use
            the word "gnostic" at all.
          </p>
          <p>
            Gnosis, at its essence, is not a label or an affiliation. It is a universal experience—the direct
            awakening of consciousness that exists in every human being as their birthright. It transcends definitions,
            institutions, and the boundaries of language itself. The humble farmer who works the land with presence
            and gratitude may possess more gnosis than the scholar who has memorized every sacred text. The grandmother
            who has learned through a lifetime of conscious suffering may understand more of the divine mysteries than
            the most eloquent spiritual teacher.
          </p>

          <blockquote>
            <p>"Gnosis is lived upon facts, withers away in abstractions, and is difficult to find even in the noblest of thoughts."</p>
            <cite>— Samael Aun Weor</cite>
          </blockquote>

          <p>
            This profound truth reminds us that gnosis cannot be captured in concepts or confined to organizations.
            It is found in the awakened moment, in conscious action, in the direct experience of reality. A person
            who has never heard the word "gnosis" but who lives with awareness, who works sincerely on their
            psychological defects, who serves others without expectation of reward—this person walks the gnostic path,
            regardless of what they call it.
          </p>
          <p>
            The Sufi mystic turning in prayer, the Buddhist monk in meditation, the Christian contemplative absorbed
            in divine union, the indigenous healer communing with nature, the simple person who has learned humility
            through life's trials—all who sincerely seek to awaken consciousness and discover the divine within
            themselves are part of this family.
          </p>

          <blockquote>
            <p>"Do not depend on others' ideas or concepts because inside yourself is the Wisdom."</p>
            <cite>— Samael Aun Weor</cite>
          </blockquote>

          <p>
            Aquarian Gnosis recognizes that the path of awakening takes countless forms. What matters is not the
            name we give to our practice, but the sincerity of our aspiration and the fruits of our inner work.
            We are all students of the same universal teaching, whether we study it through the lens of gnosis,
            mysticism, or simply through the school of conscious living.
          </p>
          <p>
            This shared aspiration—to awaken, to know ourselves, to serve humanity—makes us one family. And
            Aquarian Gnosis exists to nurture that connection, welcoming all who walk the path of self-knowledge,
            in whatever form that path may take.
          </p>
        </section>

        <section className="about-section">
          <h3>Core Values of Aquarian Gnosis</h3>

          <h4>Unity</h4>
          <p>
            We recognize all sincere seekers of self-knowledge as members of one spiritual family, regardless of
            organizational affiliation, spiritual tradition, or geographic location. We seek to bridge divides
            and foster connection among practitioners worldwide.
          </p>

          <h4>Authenticity</h4>
          <p>
            We remain faithful to the original teachings of Samael Aun Weor and the universal wisdom tradition,
            presenting them without distortion while respecting the diverse approaches of various spiritual schools
            and paths.
          </p>

          <h4>Accessibility</h4>
          <p>
            In keeping with the spirit of Aquarius, we believe that spiritual knowledge should be freely available
            to all sincere seekers. The platform is designed to be open, welcoming, and accessible to anyone with
            a genuine aspiration for self-knowledge.
          </p>

          <h4>Privacy and Safety</h4>
          <p>
            We recognize that spiritual practice is a deeply personal matter. User privacy is treated as a fundamental
            right, with robust controls allowing individuals to share as much or as little as they choose with the community.
          </p>

          <h4>Community-Driven Growth</h4>
          <p>
            The platform evolves according to the needs of its community. Features, resources, and direction are
            shaped by user input, ensuring that Aquarian Gnosis remains relevant and useful for practitioners at all levels.
          </p>
        </section>

        <section className="about-section">
          <h3>The Platform Vision</h3>
          <p>
            Aquarian Gnosis manifests this philosophy through a digital platform designed to serve the practical
            needs of spiritual practitioners worldwide:
          </p>

          <h4>Interactive Global Map</h4>
          <p>
            An interactive map enabling practitioners to discover fellow seekers in their area, find gnostic centers
            and organizations, and connect with traveling instructors and study groups—all with robust privacy controls.
          </p>

          <h4>Community Forums</h4>
          <p>
            Discussion spaces organized by topic—The Three Factors, Dream Yoga, Alchemy, Meditation, and more—where
            students can share insights, ask questions, and support one another in their inner work.
          </p>

          <h4>Study Groups</h4>
          <p>
            Tools for forming and managing study groups, whether local or virtual, enabling practitioners to coordinate
            regular study sessions and progress together through the teachings.
          </p>

          <h4>Resource Library</h4>
          <p>
            A curated collection of gnostic resources—books, audio lectures, videos, blogs, and sacred art—submitted
            and rated by the community, making quality materials discoverable and accessible.
          </p>

          <h4>Organizations Directory</h4>
          <p>
            A comprehensive directory of gnostic organizations worldwide, helping seekers find instruction and
            community in their own traditions.
          </p>
        </section>

        <section className="about-section developer-message">
          <h3>A Message from the Developer</h3>
          <p>
            I spent many years searching for the truths found within the Gnostic tradition. This is my opportunity
            to give back by freely sharing these life-changing resources with those who are seeking answers to life's
            biggest questions, as I was. Of course, I am still searching. But the dimension has changed. With these
            teachings, one is given the opportunity to stop asking questions of the exterior world and to turn the
            questions inward—to begin to understand and dissolve the self, where all misconceptions originate.
          </p>
          <p>
            Beyond mere resources, this is a platform for connection. As I travel the world, I am looking for ways
            to find and connect with other gnostics—or indeed anyone who is on the path or seeking the path. More
            specifically, the direct path. So I created this tool: to enhance connections between existing gnostic
            communities and to spark new ones; to enable the formation of study groups spontaneously between
            independent practitioners. Gnosis should be shared freely among the people. The mission of this project
            is to be a medium by which these teachings can freely flow between communities and spread to more people.
          </p>
          <p>
            Aquarian Gnosis is not an institution. It is not the purpose of Aquarian Gnosis to teach gnosis, except
            indirectly through the sharing of existing resources—especially those of Samael Aun Weor. Aquarian Gnosis
            may facilitate teaching on its platform for those teachers who choose to share via the formation of study
            groups, participation in the forums, and so on. But fundamentally, Aquarian Gnosis is a community-driven
            platform where the resources shared and direction of activity will be primarily dictated by the participation
            of the community. Participants are encouraged to be responsible for their own growth individually in Gnosis.
            This should be remembered when interacting with users on the platform—whether from any one organisation,
            independent users, or any users perceived to be associated with "Aquarian Gnosis."
          </p>
          <p className="emphasis">
            <em>Gnosis is a profoundly personal experience.</em>
          </p>
        </section>

        <section className="about-section invitation">
          <h3>An Invitation to Seekers</h3>
          <p>
            Aquarian Gnosis is more than a website—it is a manifestation of the Aquarian spirit in the digital age.
            It is a call to unity among the scattered communities of spiritual practitioners, a resource for seekers
            on the path of self-knowledge, and a testament to the living power of the perennial wisdom.
          </p>
          <p>
            Whether you are a newcomer to gnostic studies or a lifelong practitioner, whether you study with a formal
            organization or walk the path alone, whether you call yourself a gnostic or simply a seeker of truth—you
            are welcome here. We are one family, united in our aspiration to awaken consciousness and realize our
            true divine nature.
          </p>

          <blockquote>
            <p>
              "We are not interested in anyone's money or excited by monthly fees or by classrooms of brick and mortar,
              because we are conscious attendants of the Cathedral of the Soul and we know that Wisdom belongs to the Soul."
            </p>
          </blockquote>

          <p className="blessing">
            May all beings awaken to the light within them. May all seekers find the guidance they need.
            May the Aquarian age fulfill its promise of unity, wisdom, and the revolution of consciousness.
          </p>
        </section>

        <footer className="about-footer">
          <p className="divider">✦ ✦ ✦</p>
          <p className="site-name"><strong>aquariangnosis.org</strong></p>
          <p className="tagline"><em>Uniting seekers of truth across all traditions</em></p>
        </footer>
      </article>
    </div>
  );
};
