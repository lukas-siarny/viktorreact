import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
// import ListDivided from './ListDivided'
import Quote from './Quote'
import { SECTIONS } from '../utils/enums'

const About = () => {
	const { t, i18n } = useTranslation()

	const sections = SECTIONS[i18n.language as keyof typeof SECTIONS]

	return (
		<section className='section-base about' id={sections.ABOUT}>
			<div className='about-content container'>
				<h2>{t('loc:O nás')}</h2>
				<p>
					<Trans
						defaults={t(
							'loc:Firma pod menom <strong>KA-BE kovo s.r.o.</strong> pôsobí na trhu od roku 2006, založená na 30 ročnej skúsenosti absolventa ŠÚP v Kremnici Ľuboša Krajana, ktorú dodnes vedie. Naša práca je založená na kvalite profesionálnej dobovej, ale aj modernej ručnej práce, ktorá dýcha príjemnou nostalgiou zašlých kovov. Práce môžte vidieť v našej realizácii alebo pri osobnom stretnutí vo firmených katalógoch. V rámci našej profesii sa venujeme rôznym kombináciam ako napríklad drevo, kameň, sklo, keramika a iné.'
						)}
						components={{ strong: <strong /> }}
					/>
				</p>
				<h3>{t('loc:Počas dlhoročnej praxe máme bohaté skúsenosti, ako sú')}:</h3>
				<p className='text-list'>{t('loc:brány / ploty / mreže / zábradlia / svietniky / panty / zámky / krbové doplnky...')}</p>
				<h3>{t('loc:Súčasťou výrobku je povrchová úprava ako napr.')}:</h3>
				<p className='text-list'>{t('loc:povrchové striekanie / žiarové pozinkovanie / rôzne tipy patinovania / pieskovanie / leštenie / konzervovanie / černenie...')}</p>
				<h3>{t('loc:Ako firma sa venujeme aj rôznym technikám napr.')}:</h3>
				<p className='text-list'>{t('loc:nitovanie / tepanie / kalenie / zprerážanie / reštaurovanie / falcovanie / patinovanie / smaltovanie...')}</p>
				<Quote />
			</div>
		</section>
	)
}

export default About
